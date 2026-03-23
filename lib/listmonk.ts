import pg from "pg"

const { Pool } = pg

// Lazy-initialized Listmonk PostgreSQL connection
let pool: pg.Pool | null = null

function getPool() {
  if (!pool && process.env.LISTMONK_DB_HOST) {
    pool = new Pool({
      host: process.env.LISTMONK_DB_HOST,
      port: parseInt(process.env.LISTMONK_DB_PORT || "5432"),
      database: process.env.LISTMONK_DB_NAME || "listmonk",
      user: process.env.LISTMONK_DB_USER || "listmonk",
      password: process.env.LISTMONK_DB_PASS || "",
    })
  }
  return pool
}

const LISTMONK_LIST_ID = parseInt(process.env.LISTMONK_LIST_ID || "1")

interface SubscriberData {
  email: string
  name: string
  attribs?: Record<string, unknown>
}

export async function addToListmonk(data: SubscriberData): Promise<boolean> {
  const db = getPool()
  if (!db) {
    console.log("[Listmonk] Database not configured, skipping")
    return false
  }

  const client = await db.connect()
  try {
    const attribs = {
      cofi: {
        ...data.attribs,
        registeredAt: new Date().toISOString(),
      },
    }

    // Check if subscriber exists
    const existing = await client.query(
      "SELECT id, attribs FROM subscribers WHERE email = $1",
      [data.email]
    )

    let subscriberId: number

    if (existing.rows.length > 0) {
      subscriberId = existing.rows[0].id
      const mergedAttribs = { ...existing.rows[0].attribs, ...attribs }
      await client.query(
        "UPDATE subscribers SET name = $1, attribs = $2, updated_at = NOW() WHERE id = $3",
        [data.name, JSON.stringify(mergedAttribs), subscriberId]
      )
      console.log(
        `[Listmonk] Updated existing subscriber: ${data.email} (ID: ${subscriberId})`
      )
    } else {
      const result = await client.query(
        `INSERT INTO subscribers (uuid, email, name, status, attribs, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, 'enabled', $3, NOW(), NOW())
         RETURNING id`,
        [data.email, data.name, JSON.stringify(attribs)]
      )
      subscriberId = result.rows[0].id
      console.log(
        `[Listmonk] Created new subscriber: ${data.email} (ID: ${subscriberId})`
      )
    }

    // Add to CoFi list
    await client.query(
      `INSERT INTO subscriber_lists (subscriber_id, list_id, status, created_at, updated_at)
       VALUES ($1, $2, 'confirmed', NOW(), NOW())
       ON CONFLICT (subscriber_id, list_id) DO UPDATE SET status = 'confirmed', updated_at = NOW()`,
      [subscriberId, LISTMONK_LIST_ID]
    )
    console.log(`[Listmonk] Added to list ${LISTMONK_LIST_ID}: ${data.email}`)

    return true
  } catch (error) {
    console.error("[Listmonk] Error:", error)
    return false
  } finally {
    client.release()
  }
}

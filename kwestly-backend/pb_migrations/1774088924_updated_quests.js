/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1m57qfb97j9hx74")

  collection.indexes = [
    "CREATE INDEX `idx_duqOjuO` ON `quests` (`worker_id`)",
    "CREATE INDEX `idx_D5jHFmL` ON `quests` (`status`)",
    "CREATE INDEX `idx_RqNFaoo` ON `quests` (`difficulty`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1m57qfb97j9hx74")

  collection.indexes = []

  return dao.saveCollection(collection)
})

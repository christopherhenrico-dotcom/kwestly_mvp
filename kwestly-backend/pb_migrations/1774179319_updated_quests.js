/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1m57qfb97j9hx74")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.id != ''"
  collection.updateRule = "poster_id = @request.auth.id"
  collection.deleteRule = "poster_id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1m57qfb97j9hx74")

  collection.listRule = "id = @collection.users.created"
  collection.viewRule = "id = @collection.users.created"
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})

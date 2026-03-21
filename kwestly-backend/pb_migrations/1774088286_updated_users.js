/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.createRule = "id = @request.auth.github_id"
  collection.updateRule = null
  collection.deleteRule = null

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oyfhrtky",
    "name": "github_id",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jzfyc6x0",
    "name": "github_username",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gzmnolpm",
    "name": "avatar_url",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7cbcenas",
    "name": "execution_score",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ypgtri0q",
    "name": "total_earned",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "htd14bek",
    "name": "quests_completed",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wzymucyt",
    "name": "rank",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "bronze",
        "silver",
        "gold",
        "elite"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dh8tuqyt",
    "name": "wallet_address",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "iyvp24fm",
    "name": "last_score_update",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.createRule = ""
  collection.updateRule = "id = @request.auth.id"
  collection.deleteRule = "id = @request.auth.id"

  // remove
  collection.schema.removeField("oyfhrtky")

  // remove
  collection.schema.removeField("jzfyc6x0")

  // remove
  collection.schema.removeField("gzmnolpm")

  // remove
  collection.schema.removeField("7cbcenas")

  // remove
  collection.schema.removeField("ypgtri0q")

  // remove
  collection.schema.removeField("htd14bek")

  // remove
  collection.schema.removeField("wzymucyt")

  // remove
  collection.schema.removeField("dh8tuqyt")

  // remove
  collection.schema.removeField("iyvp24fm")

  return dao.saveCollection(collection)
})

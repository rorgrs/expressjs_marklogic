/* // (1) Write the objects to the database
db.createCollection('products', products).result()
    .then(function (uris) {
        console.log('Saved ' + uris.length + ' objects with URIs:');
        console.log(uris);

        // (2) Read back all objects in the collection
        return db.documents.query(
            qb.where(qb.collection(collName))
        ).result();
    }, function (error) {
        console.log(JSON.stringify(error));
    })
    .then(function (documents) {
        console.log('\nFound ' + documents.length + ' documents:');
        documents.forEach(function (document) {
            console.log(document.content);
        });

        // (3) Find the cats in the collection
        return db.documents.query(
            qb.where(qb.collection(collName), qb.value('kind', 'cat'))
        ).result();
    })
    .then(function (documents) {
        console.log('\nFound the following cats:');
        documents.forEach(function (document) {
            console.log('  ' + document.content.name);
        });

        // (4) Remove the collection from the database
        db.removeCollection(collName);
    }); */
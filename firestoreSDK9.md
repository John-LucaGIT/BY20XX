### Write a collection reference
```js
 const yourReference = doc(collection(db, "yourCollection"), collectionID);
 ```
 --> Leave "collectionID" blank for autoID

### Write a sub collection reference
```js
 const yourSubCollectionReference = doc(collection(yourReference, yourSubCollection));
 ```
 --> In this case "yourReference" refers to the collection created above.
 --> Since we left out the "collectionID" "yourSubCollection" will automatically creat unique ID's

### Create a batched write
```js
yourItemsArray.forEach(yourItem => {
    batch.set(yourCollectionReference,{
        id: example.id,
        text: example.text
        });
    });
    await batch.commit();
```
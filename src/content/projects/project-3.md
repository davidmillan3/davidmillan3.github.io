---
title: 'NoSQL'
description: Evidencias NoSQL.
publishDate: 'Feb 15 2026'
seo:
  image:
    src: '../../assets/images/project-1.jpg'
    alt: Imagen NoSQL
---

## Evidencia Consultas en MongoDB

Trabajo en clase en mongodb, se trabajo en la base de datos de Airbnb sobre consultas basicas, ademas de eso se aprendio algunos operadores

```sql
// Filtter by range
db.usuarios.find({ edad: { $gte: 18, $lte: 30 } })

// Filtter by multiple conditions
db.usuarios.find({
    $and: [
        { edad: { $gte: 18 } },
        { edad: { $lte: 30 } },
        { ciudad: "Buenos Aires" }
    ]
})

// Filtter by multiple conditions with projection
db.usuarios.find(
    {
        $and: [
            { edad: { $gte: 18 } },
            { edad: { $lte: 30 } },
            { ciudad: "Buenos Aires" }
        ]
    },
    { nombre: 1, edad: 1, ciudad: 1, _id: 0 }
)

// $nin operator - Not in
db.usuarios.find({ ciudad: { $nin: ["Buenos Aires", "Cordoba"] } })

// $exists operator - Field exists
db.usuarios.find({ telefono: { $exists: true } })

// $elemMatch operator - Match array elements
db.usuarios.find({ hobbies: { $elemMatch: { $eq: "futbol", size: 2} } })

// $regex operator - Regular expression
db.usuarios.find({ nombre: { $regex: /^J/ } }) // Nombres que comienzan con J


use ("sample_airbnb");


db.listingsAndReviews.find({
    $and: [
    { "address.market": "Porto" }
    ]
});

use ("sample_airbnb");

db.listingsAndReviews.find(
    { "address.market": "Porto" },
    { "name": 1, "price": 1, "address.market": 1, "_id": 0 },// Projection
    { sort: { price: -1 }, // Sort by price descending
      limit: 5 } // Limit to 5 results
);

// Buscar todos los alojamientos tipo apartamento y con amenidades con wifi y television por cable
use ("sample_airbnb");
// $elemMatch operator - Match array elements
db.listingsAndReviews.find(
    { 
        "property_type": "Apartment",
        "amenities": { $elemMatch: { $in: ["Cable TV", "Wifi"] } } 
    },
    { 
        "name": 1, 
        "amenities": 1, 
        "address.country": 1, 
        "_id": 0 
    }
);

// $all operator - Match all elements in an array
use ("sample_airbnb");

db.listingsAndReviews.find(
    { 
        "property_type": "Apartment",
        "amenities": { $all: ["Cable TV", "Wifi"] } 
    }, 
    {
        "name": 0, 
        "amenities": 0, 
        "address.country": 1,
        "beds": 1,
        "_id": 0 
    }
);


db.listingsAndReviews.find(
    {   
        "property_type": "Apartment",
        "amenities": { $all: ["Cable TV", "Wifi"] } 
    }, 
    {
        "name": 0, 
        "amenities": 0, 
        "address.country": 1,
        "beds": 1,
        "_id": 0 
    }
);
```

## Evidencia Taller 3

```sql
//Punto 1
use("sample_airbnb");
db.listingsAndReviews.insertOne({ 
  name: "Cozy Cabin Retreat", 
  summary: "Cabaña acogedora para descansar", 
  property_type: "Cabin", 
  Price: 150.00 
}) 

//Punto 2
use("sample_airbnb");
Codigo: 
db.listingsAndReviews.insertOne({ 
  name: "Apartamento en Santiago", 
  summary: "Alojamiento moderno en Chile", 
  property_type: "Apartment", 
  price: 120, 
  address: { 
    country: "Chile", 
    market: "Santiago" 
  }, 
  amenities: ["Wifi", "Kitchen"] 
}) 

//Punto 3
use("sample_airbnb"); 
db.listingsAndReviews.insertMany([ 
  { 
    name: "Studio de Arte Urbano", 
    price: 80.00 
  }, 
  { 
    name: "Loft Minimalista", 
    Price: 110.00 
  } 
]) 

//Punto 4
use("sample_airbnb");
db.listingsAndReviews.insertOne({ 
  name: "Casa con Comodidades", 
  price: 200, 
  amenities: ["Wifi", "Kitchen", "Free parking"] 
}) 

//Punto 5
use("sample_airbnb");
db.listingsAndReviews.insertOne({ 
  _id: ObjectId("64b123456789123456789111"), 
  name: "Duplicado", 
  Price: 100 
}) 

//Punto 6
use("sample_airbnb");
db.listingsAndReviews.find( 
  { "address.country": "Brazil" }, 
  { name: 1, Price: 1, _id: 0 } 
) 

//Punto 7
use("sample_airbnb");
db.listingsAndReviews.find( 
  { beds: { $gt: 5 } }, 
  { name: 1, number_of_reviews: 1, _id: 0 } 
) 

//Punto 8
use("sample_airbnb");
db.listingsAndReviews.find( 
  { price: { $lt: 75 } }, 
  { name: 1, price: 1, property_type: 1, _id: 0 } 
) 

//Punto 9
use("sample_airbnb");
db.listingsAndReviews.find( 
  { 
    $and: [ 
      { property_type: "Apartment" }, 
      { "address.market": "New York" } 
    ] 
  } 
) 

//Punto 10
use("sample_airbnb");
db.listingsAndReviews.find({ 
  property_type: { 
    $in: ["House", "Condominium"] 
  } 
}) 

//Punto 11
use("sample_airbnb");
db.listingsAndReviews.find({ 
  name: { $regex: "Luxury", $options: "i" } 
}) 

//Punto 12
use("sample_airbnb");
db.listingsAndReviews.find({ 
  amenities: "Heating" 
}) 

//Punto 13
use("sample_airbnb");
db.listingsAndReviews.find({ 
  amenities: { $size: 20 } 
}) 

//Punto 14
use("sample_airbnb");
db.listingsAndReviews.find(
  {},
  {
    name: 1,
    price: 1,
    "address.country": 1,
    _id: 0
  }
)
.sort({ price: -1 })
.limit(10)

//Punto 15
use("sample_airbnb");
db.listingsAndReviews.find( 
  { 
    $or: [ 
      { last_review: null }, 
      { last_review: { $exists: false } } 
    ] 
  }, 
  { 
    name: 1, 
    summary: 1, 
    description: 1, 
    _id: 0 
  } 
) 
.sort({ number_of_reviews: -1 }) 

//Punto 16
use("sample_airbnb");
db.listingsAndReviews.updateOne( 
  { name: "Cozy Cabin Retreat" }, 
  { 
    $set: { 
      property_type: "Entire home/apt" 
    } 
  } 
) 

//Punto 17
use("sample_airbnb");
db.listingsAndReviews.updateOne( 
  { name: "Apartamento en Santiago" }, 
  { 
    $set: { 
      property_type: "Apartment Deluxe" 
    }, 
    $push: { 
      amenities: "Smart TV" 
    } 
  } 
) 

//Punto 18
use("sample_airbnb");
db.listingsAndReviews.updateMany( 
  { "address.country": "Spain" }, 
  { 
    $inc: { 
      number_of_reviews: 1 
    } 
  } 
)  

//Punto 19
use("sample_airbnb");
db.listingsAndReviews.updateMany( 
  { amenities: "Cable TV" }, 
  { 
    $pull: { 
      amenities: "Cable TV" 
    } 
  } 
) 

//Punto 20
use("sample_airbnb");
db.listingsAndReviews.updateOne(
  { name: "Mansión de Prueba" },
  {
    $set: {
      price: 1500.00,
      "address.country": "United States"
    }
  },
  { upsert: true }
)

//Punto 21
use("sample_airbnb");
db.listingsAndReviews.aggregate([
  {
    $match: {
      amenities: { $exists: true },
      $expr: {
        $gt: [{ $size: "$amenities" }, 10]
      }
    }
  },
  {
    $count: "total_listings"
  }
])

//Punto 22
use("sample_airbnb");
db.listingsAndReviews.aggregate([
  {
    $group: {
      _id: "$address.country",
      promedio_precio: {
        $avg: "$price"
      }
    }
  }
])

//Punto 23
use("sample_airbnb");
db.listingsAndReviews.aggregate([
  {
    $unwind: "$amenities"
  },
  {
    $group: {
      _id: "$amenities",
      total: { $sum: 1 }
    }
  },
  {
    $sort: { total: -1 }
  },
  {
    $limit: 5
  }
])

//Punto 24
use("sample_airbnb");
db.listingsAndReviews.aggregate([
  {
    $group: {
      _id: "$property_type",
      total: { $sum: 1 }
    }
  },
  {
    $sort: { total: -1 }
  }
])

//Punto 25
use("sample_airbnb");
db.listingsAndReviews.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      price: 1,
      price_entero: {
        $toInt: "$price"
      }
    }
  }
])

//Punto 26
use("sample_airbnb");
db.listingsAndReviews.aggregate([
  {
    $match: {
      number_of_reviews: { $gte: 10 }
    }
  },
  {
    $group: {
      _id: null,
      promedio_rating: {
        $avg: "$review_scores.review_scores_rating"
      }
    }
  }
])

//Punto 27
use("sample_airbnb");
db.listingsAndReviews.aggregate([
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 101, 301, 1000],
      default: "1000+",
      output: {
        cantidad: { $sum: 1 }
      }
    }
  }
])

//Punto 28
use("sample_airbnb");
db.listingsAndReviews.aggregate([
  {
    $lookup: {
      from: "hosts",
      localField: "host.host_id",
      foreignField: "host_id",
      as: "host_info"
    }
  }
])

//Punto 29
use("sample_airbnb");
db.listingsAndReviews.aggregate([
  {
    $group: {
      _id: "$property_type",
      promedio_huespedes: {
        $avg: "$accommodates"
      }
    }
  },
  {
    $sort: {
      promedio_huespedes: -1
    }
  }
])

//Punto 30
use("sample_airbnb");
db.listingsAndReviews.aggregate([
  {
    $match: {
      last_review: { $exists: true }
    }
  },
  {
    $group: {
      _id: {
        año: { $year: "$last_review" }
      },
      total: { $sum: 1 }
    }
  },
  {
    $sort: {
      "_id.año": 1
    }
  }
])
```


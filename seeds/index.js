require('dotenv').config();
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl)
    .then(() => {
        console.log("MONGO CONNECTION OPEN");
    })
    .catch((err) => {
        console.log("MONGO CONNECTION ERROR");
        console.log(err);
    });

const randomElement = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '',
            title: `${randomElement(descriptors)} ${randomElement(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dcqgy1j8z/image/upload/v1639340540/YelpCamp/augaqra5odtjw51dqkms.jpg',
                    fileName: 'YelpCamp/augaqra5odtjw51dqkms'
                },
                {
                    url: 'https://res.cloudinary.com/dcqgy1j8z/image/upload/v1639340544/YelpCamp/b6kzygmb9jncxprtkli3.jpg',
                    fileName: 'YelpCamp/b6kzygmb9jncxprtkli3'
                },
                {
                    url: 'https://res.cloudinary.com/dcqgy1j8z/image/upload/v1639340546/YelpCamp/jcgfno5gojrl61b1kntf.jpg',
                    fileName: 'YelpCamp/jcgfno5gojrl61b1kntf'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde ipsum similique eligendi? Dicta culpa incidunt, recusandae voluptatem ducimus aperiam, maxime totam sit quibusdam neque rerum quidem mollitia omnis repellendus deleniti.'
        });
        await camp.save();
    }

}

seedDB()
    .then(() => {
        mongoose.connection.close();
    });

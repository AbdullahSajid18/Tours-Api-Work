


import { log } from "console";
import express from "express";

import fs from 'fs'

const app = express()

const port = 8000

const jsonTours = fs.readFileSync('./tours.json', 'utf-8')

const toursParsedData = JSON.parse(jsonTours)

// console.log(JSON.parse(jsonTours), "==>>toursJson")

app.use(express.json())

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: "success",
        data: toursParsedData
    })
})

app.get('/api/v1/tours/:toursId', (req, res) =>{
    console.log(req.params.toursId, "==>>params")
    console.log(typeof req.params.toursId, "==>>typeof")
    console.log(toursParsedData?.data.length, "==>>length")
    if((req.params.toursId * 1) > toursParsedData?.data.length) {
        return res.status(404).send('Data Not Available')
    }

    let singleTourData = toursParsedData?.data?.find(tour => tour.id == req.params.toursId)

    // console.log(singleTourData, "single tourdata");
    res.status(200).json({
        status: 'success',
        data: singleTourData
    })
})

app.post('/api/v1/tours', (req, res) => {
    // console.log(toursParsedData.data.length, 'already available tours');

    if(!req.body.destinationName || !req.body.country || !req.body.tourCapacity || !req.body.departure || !req.body.arrival || !req.body.price || !req.body.transport) {
        res.status(400).send({
            status:'Rejected', 
            data: 'Missing Fields'
        })
    }

    let dataToWriteInDb = {
        id: toursParsedData.data.length + 1,
        ...req.body
    }
    toursParsedData.data.push(dataToWriteInDb)

    fs.writeFile('./tours.json', JSON.stringify(toursParsedData), () => {
        res(200).send({
            status:'Success',
            data: "Data added Successfully"
        })
    })
})

app.delete('/api/v1/tours/:toursId', (req, res) => {
    console.log(req.params.toursId);
    let filteredData = toursParsedData.data.filter(tour => tour.id != (req.params.toursId * 1))

    toursParsedData.data = filteredData

    fs.writeFile('./tours.json', JSON.stringify(toursParsedData), ()=> {
        res.status(200).send({
            status: "Success",
            data : "Data Deleted Successfully"
        })
    })
})

app.put('/api/v1/tours/:toursId', (req , res) =>{
    // console.log(req.params.toursId);
    let indexNumber; 
    
    toursParsedData.data.forEach((tour, idx) => {
        id (tour.id === (req.params.toursId * 1)); {
            indexNumber = idx
        }
    })

    toursParsedData.data.splice(indexNumber, 1, req.body)

    fs.writeFile('./tours.json', JSON.stringify(toursParsedData), ()=> {
        res.status(200).send({
            status:'success',
            data : 'Update Successfully'
        })
    })
})





app.listen(port, () => {
    console.log(`Server running on port number ${port}`)
})
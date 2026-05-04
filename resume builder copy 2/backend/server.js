import express from 'express'
const app = express()

app.get('/', (req, res) => {
    res.json({ name: 'Mohit', age: 22 });
})


const port = 4444
app.listen(port, () => {
    console.log('server is runnin localhost', port)
})
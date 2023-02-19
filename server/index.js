import express from 'express'
import pg from 'pg'
import cors from 'cors'

const dbCredentials = {
    host: 'db',
    user: 'postgres',
    password: 'postgres',
    database: 'luxonis',
    port: 5432,
}

const db = new pg.Pool(dbCredentials)

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/',(req,res)=>{
    res.send({version:1})
})

app.get('/apartments',(req,res)=>{
    const page = Number(req.query.page) || 1
    const recordsPerPage = Number(req.query.recordsPerPage) || 10

    const offset = (page - 1) * recordsPerPage
    const query = `SELECT title, price, id FROM apartments LIMIT ${recordsPerPage} OFFSET ${offset}`

    db.query(query,(err,result)=>{
        if(err){
            res.status(500).send({error:err})
        }else{
            const ids = result.rows.map(r=>r.id).join(",")
            const imagesQuery = `SELECT * FROM images WHERE apartment_id IN (${ids})`
            db.query(imagesQuery,(err,imagesResult)=>{
                if(err){
                    res.status(500).send({error:err})
                }else{
                    const apartments = result.rows.map(r=>({
                        ...r,
                        images: imagesResult.rows.filter(i=>i.apartment_id === r.id).map(i=>i.url)
                    }))
                    res.send({apartments})
                }
            })
        }
    })
})

app.listen(3001,()=>{
    console.log('Server started')
})
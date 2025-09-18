import postgres from "postgres"

//connect  with the database

const sql = postgres(process.env.DATABASE_URL!, {
    ssl:{
        rejectUnauthorized: false,
    }
})

export default sql;
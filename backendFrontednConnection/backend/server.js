import express from 'express';

const app = express();

// app.get('/', (req, res) => {
//   res.send('Server is ready');
// });

// get a list of 5 jokes

app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id : 1,
            title : "Why don't scientists trust atoms?",
            punchline : "Because they make up everything!"  
        },
        {
            id : 2, 
            title : "Why did the bicycle fall over?",   
            punchline : "Because it was two-tired!"

        },
        {
            id : 3,
            title : "What do you call fake spaghetti?",   
            punchline : "An impasta!"
        },
        {
            id : 4,
            title : "Why did the scarecrow win an award?",   
            punchline : "Because he was outstanding in his field!"      
        },
        {
            id : 5,
            title : "Why don't skeletons fight each other?",   
            punchline : "They don't have the guts!"      
        }
    ];
    res.send(jokes);
}); 
        



const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    }
);



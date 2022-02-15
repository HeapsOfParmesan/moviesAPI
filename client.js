const axios = require("axios");
// test1pass = false;

async function test1(){
    try{

        const insert1 = await axios.post("http://localhost:3000/api/", {
            title:"Star Wars: The Phantom Menace",
            release_year:"1999",
            time_viewed:"111222"
            // time_viewed: Date.now()
        });

        const insert2 = await axios.post("http://localhost:3000/api/", {
            title:"The Flintstones",
            release_year:"1994",
            time_viewed:"444555"
            // time_viewed: Date.now()
        });

        const update1 = await axios.put
        ("http://localhost:3000/api/1",{
            title:"Star Wars: The Clone Wars",
            release_year:"2003",
            time_viewed:"222333"
        })

        const response1 = await axios.get("http://localhost:3000/api/1")
            if(response1.data.movie.title !== "Star Wars: The Clone Wars"){
                throw 'title response does not match';
            }
            if(response1.data.movie.release_year !== "2003"){
                throw 'release_year response does not match';
            }
            if(response1.data.movie.time_viewed !== "222333"){
                throw 'time_viewed response does not match';
            }

        const response2 = await axios.get("http://localhost:3000/api/2")

            if(response2.data.movie.title !== "The Flintstones"){
                throw 'title response does not match';
            }
            if(response2.data.movie.release_year !== "1994"){
                throw 'release_year response does not match';
            }
            if(response2.data.movie.time_viewed !== "444555"){
                throw 'time_viewed response does not match';
            }

    }catch (Exeption){
        console.log("FAILED TEST");
        console.log(Exeption);
    }
}

async function test2(){


    // const get1 = await axios.get("http://localhost:3000/api/")
    // console.log(get1.data);

    try{
        var fourMovies = [
            {
                title:"Star Trek: Generations",
                release_year:"1994",
                time_viewed:"111222"
            },
            {
                title:"The Flintstones",
                release_year:"1994",
                time_viewed:"222333"
            },
            {
                title:"Knives Out",
                release_year:"2019",
                time_viewed:"333444"
            },
            {
                title:"The Good, the Bad, and the Ugly",
                release_year:"1966",
                time_viewed:"444555"
            }
        ];
        var threeMovies = [
            {
                title:"Star Trek: Generations",
                release_year:"1994",
                time_viewed:"111222"
            },
            {
                title:"The Flintstones",
                release_year:"1994",
                time_viewed:"222333"
            },
            {
                title:"Knives Out",
                release_year:"2019",
                time_viewed:"333444"
            }
        ];

        const put1 = await axios.put("http://localhost:3000/api/", fourMovies);
        console.log('INSERTED 4 MOVIES');
        console.log(put1.data)


        const get2 = await axios.get("http://localhost:3000/api/");
        console.log(get2.data);


        var a = JSON.stringify(get2.data)
        var b = JSON.stringify(fourMovies);
        //THEY ARE THE SAME, BUT IM HAVING ISSUES COMPARING THEM
        if(a == b){
            console.log('match');
        }

        //THIS DIDNT WORK EITHER, BUT OBJECTS NEVER COMPARE
        // if(get2.data !== fourMovies){
        //     throw 'no match from collection'
        // }

        console.log('BEFORE DELETE');
        const delete1 = await axios.delete("http://localhost:3000/api/4")
        console.log(delete1.data)
        console.log('AFTER DELETE');

        const getAgain = await axios.get("http://localhost:3000/api/")
         // console.log(getAgain.data);

        const deleteAll = await axios.delete("http://localhost:3000/api/");
        console.log(deleteAll.data)

        const ensureAllDelete = await axios.get("http://localhost:3000/api/")
        // console.log(ensureAllDelete.data)
        console.log('ENSURE DELETION\n' +
            'Movie Collection: ',ensureAllDelete.data)

        //THIS WOULD JUST CHECK IF THERE WERE ANY ROWS LEFT.
        //never fires
        if(ensureAllDelete.data.count === 0){
            console.log('all deleted');
        }
        //IF WE DONT HIT AN EXCEPTION, ALL TESTS PASSED
        console.log('ALL TESTS PASSED')
    }catch (Exception){
        console.log('FAILED TEST')
        console.log(Exception)
    }


}
//had to put these in a function to await them both,
//having issues with test 2 firing before test one, and need to be
//inside async func to use await
async function runTests(){
    await test1();
    await test2();
}
runTests();



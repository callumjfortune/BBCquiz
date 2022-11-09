$("#quizForm").submit(function( event )
{
    event.preventDefault();
    console.log('Submit');
    var data = new FormData(event.target);
    
});

function checkAnswers()
{

}
// send messages

let send = (e) => {
    e.preventDefault();
    Content = document.getElementById('message').value;
    User = document.getElementById('username').value;
    db = ref(database, path = 'messages/'+Date.now());
    set(db, {
        msg: Content,
        user : User
    });
    document.getElementById('message').value ='';
     User = '';
}

document.getElementById('sendForm').addEventListener('submit', send);
// append new changes to 'output' div

onValue(ref(database, 'messages/'), (snap) => {
    let outputString = "";
    for (key in snap.val()) {
        outputString += `${snap.val()[key].user}: ${snap.val()[key].msg}` + "\n";
    };
    document.getElementById('textOutput').innerHTML = outputString;
    console.log(outputString);
})
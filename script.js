// send messages

let send = (e) => {
    e.preventDefault();
    let Content = document.getElementById('message').value;
    let User = document.getElementById('username').value;
    let db = ref(database, path = 'messages/'+Date.now());
    set(db, {
        msg: Content,
        user : User
    });
    document.getElementById('message').value ='';
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

// get canvas data


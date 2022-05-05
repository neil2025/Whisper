// send messages
let form = document.getElementById('sendForm')
var messagePath = '';
let send = (e) => {
    e.preventDefault();
    let Content = form.elements[0].value;
    let User = form.elements[1].value;
    const db = ref(database, path = `messages/${messagePath}${Date.now()}`);
    set(db, {
        msg: Content,
        user: User
    });
    document.getElementById('message').value = '';
}

form.addEventListener('submit', send);
// append new changes to 'output' div

onValue(ref(database, 'messages/'), (snap) => {
    let outputString = "";
    for (key in snap.val()) {
        outputString += `${snap.val()[key].user}: ${snap.val()[key].msg}` + "\n";
    };
    document.getElementById('textOutput').innerHTML = outputString;
})

// get canvas data
// API KEY: 4851~XAVozN0ZoKzbGzkS5nabWUpQ0yHtwx1FCpMt40EACu55NASF2pFg13BNm48kF8YG

function getCourses() {
    const URL = "https://dwight.instructure.com/api/v1/courses";
    // const URL = "https://jsonplaceholder.typicode.com/todos/2";
    // let params = {
    //     headers: {
    //         'Authorization': 'Bearer 4851~XAVozN0ZoKzbGzkS5nabWUpQ0yHtwx1FCpMt40EACu55NASF2pFg13BNm48kF8YG',
    //     },
    //     method: "GET",
    //     mode: 'no-cors'
    // };
    // fetch(URL, params)
    // .then(raw => raw.json())
    // .then(data => {console.log(data)})
    let newWin = window.open(URL, '', 'popup');
}

document.getElementById('getCourses').addEventListener('submit', (e) => {
    e.preventDefault();
    let entry = document.getElementById('coursesEntry');
    var courses = JSON.parse(entry.value).filter(o => (o.start_at.split('-')[0] == '2021')).map((i) => {
        return {
            Name: i.name,
            ClassID: i.id,
        }
    })
    console.log(courses);
    entry.value = '';
    let classes = document.getElementById('courses');
    for (let item of courses) {
        let inp = document.createElement('input');
        inp.setAttribute('id', item.Name);
        inp.setAttribute('class', 'courseButton');
        inp.setAttribute('type', 'radio');
        let lab = document.createElement('label');
        lab.setAttribute('for', item.Name);
        lab.appendChild(document.createTextNode(item.Name));
        let newDiv = document.createElement('div');
        newDiv.appendChild(inp);
        newDiv.appendChild(lab);
        classes.appendChild(newDiv);

    }
})
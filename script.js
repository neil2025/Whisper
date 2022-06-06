// settings window

let settingsWindow = document.querySelector("#settingsWindow");
let gear = document.querySelector("#gear");

gear.onclick = () => {
  if (settingsWindow.offsetLeft < 0) {
    settingsWindow.style.left = "-0%";
    gear.style.transform = "rotate(90deg)";
  } else if (settingsWindow.offsetLeft == 0) {
    settingsWindow.style.left = "-22.5%";
    gear.style.transform = "rotate(0deg)";
  }
};

const settingsForm = document.querySelector("#settingsWindow > form");
const root = document.querySelector(":root");
const compStyle = getComputedStyle(root);
const defaultColors = {
  '--activeAccent': compStyle.getPropertyValue('--activeAccent'),
  '--defaultAccent': compStyle.getPropertyValue('--defaultAccent'),
  '--backgroundColor': compStyle.getPropertyValue('--backgroundColor'),
  '--textColor': compStyle.getPropertyValue('--textColor'),
}
for (let elem of settingsForm.elements) {
  if (localStorage.getItem(elem.name) == null) {
    localStorage.setItem(elem.name, defaultColors[elem.name])
    root.style.setProperty(elem.name, defaultColors[elem.name]);
  } else {
    elem.value = localStorage.getItem(elem.name);
    root.style.setProperty(elem.name, elem.value);
  }
  elem.addEventListener("input", (e) => {
    root.style.setProperty(e.target.name, e.target.value);
    localStorage.setItem(e.target.name, e.target.value)
  });
  
}

const nameChange = document.querySelector('#changeName');
nameChange.value = localStorage.getItem('username')
nameChange.addEventListener('input', (e) => {
  localStorage.setItem('username', e.target.value);
})

// send messages
var form = document.getElementById("sendForm");
var messagePath = ``;
var courses;
var outputString;
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let Content = form.elements[0].value;
  const db = ref(database, (path = `messages/${messagePath}/${Date.now()}`));
  set(db, {
    msg: Content,
    user: window.localStorage.getItem("username"),
  });
  form.elements[0].value = "";
});
// append new changes to 'output' div

function updateChat(scope) {
  let newElement;
  let textOutput = document.querySelector("#textOutput");
  textOutput.innerHTML = "";
  for (key in scope) {
    newElement = document.createElement("p");
    newElement.appendChild(
      document.createTextNode(`${scope[key].user}: ${scope[key].msg}`)
    );
    textOutput.appendChild(newElement);
  }
  textOutput.scrollTop = textOutput.scrollHeight;
}

onValue(ref(database, `messages/`), (snap) => {
  if (messagePath !== "") {
    updateChat(snap.val()[messagePath]);
  } else {
    textOutput.innerHTML = "Please Select a Class to Chat in";
  }
});

// Get Canvas Class Data

window.onload = () => {
  try {
    courses = JSON.parse(window.localStorage.getItem("studentCourses"));
    makeButtons(courses);
  } catch (err) {
    showModal();
  }
};

// Make Chats

function makeButtons(cs) {
  let classes = document.getElementById("courses");
  for (let item of cs) {
    let inp = document.createElement("input");
    inp.setAttribute("id", item.ClassID);
    inp.setAttribute("type", "button");
    inp.setAttribute("value", item.Name);

    let newDiv = document.createElement("div");
    newDiv.appendChild(inp);
    classes.appendChild(newDiv)

    document.getElementById(item.ClassID).addEventListener("click", (e) => {
      messagePath = `${e.target.id}`;

      get(child(ref(database), `messages/${messagePath}/`)).then((snap) => {
        outputString = "";
        if (snap.exists()) {
          updateChat(snap.val());
        } else if (
          confirm(
            `No chat exists for this course. Make new chat for course "${e.target.value}"?`
          )
        ) {
          set(ref(database, `messages/${messagePath}/${Date.now()}`), {
            msg: `Welcome to ${e.target.value}!`,
            user: window.localStorage.getItem("username"),
          });
        } else {
          messagePath = "";
        }
      });
    });
  }
  let items = document.querySelectorAll("div#courses > div");
  items.forEach((i) => {
    i.style.height = `${100 / cs.length}%`;
  });
}

// modal window

function showModal() {
  let modal = document.getElementById("loginWindow");
  setTimeout(() => {
    modal.showModal();
  }, 500);

  let courseForm = document.getElementById("courseForm");
  courseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = [];
    for (let b of courseForm.elements) {
      formData.push(b.value);
    }
    if (!formData.includes("")) {
      modal.close();
      courses = JSON.parse(courseForm.elements[0].value)
        .filter((o) => o.start_at.split("-")[0] == "2021")
        .map((i) => {
          return {
            Name: i.name,
            ClassID: i.id,
          };
        });

      window.localStorage.setItem("studentCourses", JSON.stringify(courses));
      window.localStorage.setItem("username", courseForm.elements[1].value);
      makeButtons(courses);
    } else {
      alert("Please Fill al Fields"); // This is temporary, add css-based alert later
    }
  });
}

// Clear All Chats

//hey! no peeking!
function clearChat() {
  if (prompt("Clear All Chats?") === "Yes") {
    set(ref(database, `messages`), "");
    alert("cleared");
  } else {
    alert("Not Clearing");
  }
}

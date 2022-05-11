// send messages
var form = document.getElementById("sendForm");
var messagePath = ``;
var courses;
var outputString;
let send = (e) => {
  e.preventDefault();
  let Content = form.elements[0].value;
  let User = form.elements[1].value;
  window.localStorage.setItem("username", User);
  const db = ref(database, (path = `messages/${messagePath}/${Date.now()}`));
  set(db, {
    msg: Content,
    user: User,
  });
  document.getElementById("message").value = "";
};

form.addEventListener("submit", send);
// append new changes to 'output' div

onValue(ref(database, `messages/`), (snap) => {
  let value;
  if (messagePath !== "") {
    value = snap.val()[messagePath];
  } else {
    value = snap.val();
  }
  outputString = "";
  for (key in value) {
    outputString += `${value[key].user}: ${value[key].msg}` + "\n";
  }
  document.getElementById("textOutput").innerHTML = outputString;
});

// Get Canvas Class Data

window.onload = () => {
  try {
    courses = JSON.parse(window.localStorage.getItem("studentCourses"));
    form.elements[1].value = window.localStorage.getItem("username");
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
    inp.setAttribute("class", "courseButton");
    inp.setAttribute("type", "button");
    inp.setAttribute("value", item.Name);

    let newDiv = document.createElement("div");
    newDiv.appendChild(inp);
    classes.appendChild(newDiv);

    document.getElementById(item.ClassID).addEventListener("click", (e) => {
      messagePath = `${e.target.id}`;

      get(child(ref(database), `messages/${messagePath}/`)).then((snap) => {
        console.log(snap.val());
        outputString = "";
        if (snap.exists()) {
          for (key in snap.val()) {
            outputString +=
              `${snap.val()[key].user}: ${snap.val()[key].msg}` + "\n";
          }
          document.getElementById("textOutput").innerHTML = outputString;
        } else if (
          confirm(
            `No chat exists for this course. Make new chat for course "${e.target.value}"?`
          )
        ) {
          set(ref(database, `messages/${messagePath}/${Date.now()}`), {
            msg: `Welcome to ${e.target.value}!`,
            user: form.elements[1].value,
          });

          for (key in snap.val()) {
            outputString +=
              `${snap.val()[key].user}: ${snap.val()[key].msg}` + "\n";
          }

          document.getElementById("textOutput").innerHTML = outputString;
        } else {
          messagePath = "";
        }
      });
    });
  }
}

// modal window

function showModal() {
  let modal = document.getElementById("loginWindow");
  setTimeout(() => {
    modal.showModal();
    modal.style.top = "0px";
  }, 1000);

  let courseForm = document.getElementById("courseForm");
  courseForm.addEventListener("submit", (e) => {
    e.preventDefault();
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
    entry.value = "";
    makeButtons(courses);
  });
}

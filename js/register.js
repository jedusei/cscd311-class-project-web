const
    SERVER_URL = "http://localhost",
    student = JSON.parse(sessionStorage.getItem("student")),
    lblName = $("#studentName"),
    lblID = $("#studentID"),
    lblStatus = $("#status"),
    lstHall = $("#hall"),
    lstRoom = $("#room")
btnSubmit = $("#submit");

// Initialize labels
lblName.text(student.name);
lblID.text(student.id);

if (student.hall) { // Student has registered for a hall
    lblStatus.text("Registered");
    lblStatus.addClass("text-primary");
    lstHall.append(`<option selected>${student.hall}</option>`);
    lstRoom.append(`<option selected>${student.room}</option>`);
    btnSubmit.addClass("d-none");
}
else {
    lblStatus.text("Not Registered");
    lblStatus.addClass("text-danger");
    lstHall.append("<option value='' selected disabled hidden>Please select</option>");
    lstHall.removeAttr("disabled");
    getHalls();
}

// Show the form (was hidden at start)
$("body").removeClass("invisible");

function getHalls() {
    $.get(
        SERVER_URL + "/halls",
        (halls) => {
            halls.forEach(hall => {
                lstHall.append(`<option value="${hall._id}">${hall.name}</option>`)
            })
        }
    ).fail(() => {
        alert("An error occured. Please refresh the page and try again.");
    })
}

function getRooms() {
    $.get(
        SERVER_URL + "/rooms/available",
        { hall: lstHall.val() },
        (rooms) => {
            if (rooms.length == 0) {
                lstRoom.html("<option value='' selected disabled hidden>No rooms available.</option>");
                lstRoom.attr("disabled", true);
                lstRoom.addClass("text-danger");
            }
            else {
                lstRoom.removeClass("text-danger")
                lstRoom.html("<option value='' selected disabled hidden>Please select</option>");
                rooms.forEach(room => {
                    lstRoom.append(`<option value="${room._id}">${room.name}</option>`)
                })
                lstRoom.removeAttr("disabled");
            }
        }
    ).fail(() => {
        alert("An error occured. Please refresh the page and try again.");
    });
}

function register(e) {
    e.preventDefault();
    btnSubmit.attr("disabled", true);
    $.post(
        SERVER_URL + "/apply",
        { studentID: student.id, room: lstRoom.val() },
        (result) => {
            alert("Registration successful.");
            student.hall = lstHall.find("option:selected").text();
            student.room = lstRoom.find("option:selected").text();
            sessionStorage.setItem("student", JSON.stringify(student));
            window.location.reload();
        }
    ).fail(() => {
        alert("An error occured. Please refresh the page and try again.");
        btnSubmit.removeAttr("disabled");
    });
}

function logout() {
    sessionStorage.clear();
    window.location = "login.html";
}

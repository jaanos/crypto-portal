function initialize_alphabet(mode, level) {
    if (mode == "read") {
        if (level == "easy") {
            read_easy();
        } else if (level == "hard") {
            read_hard();
        }
    } else if (mode == "write") {
        if (level == "easy") {
            write_easy();
        } else if (level == "hard") {
            write_hard();
        }
    }
}

function read_easy() {
    console.log("read, easy");
}

function write_easy() {
    console.log("write, easy");
}

function read_hard() {
    console.log("read, hard");
}

function write_hard() {
    console.log("write, hard");
}
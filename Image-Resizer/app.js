let input = document.getElementById('input');
let imgDiv = document.getElementById('imgDiv');
let showMainDiv = document.getElementsByClassName('.showMainDiv');
let maintainWidthInPx = document.querySelector('#maintainWidthInPx');
// let qualityInp = document.querySelector('#qualityInp');
let maintainWidthInPer = document.querySelector('#maintainWidthInPer');
let type = document.querySelector('#type');
let customWidth = document.getElementById('customWidth');
let customHeight = document.getElementById('customHeight');
let download = document.querySelector('#download');
let convert = document.querySelector('#convert');
download.style.visibility = "hidden";
type.addEventListener('change', () => {
    if (type.value == "ico") {
        customHeight.value = 32;
        customWidth.value = 32;
        maintainWidthInPx.value = 32;
    }
})

function disable({ maintainWidthInPx, maintainWidthInPer, customWidth, customHeight }) {
    if (maintainWidthInPx) {
        maintainWidthInPx.value = "";
    }
    if (maintainWidthInPer) {
        maintainWidthInPer.value = "";
    }
    if (customWidth) {
        customWidth.value = "";
    }
    if (customHeight) {
        customHeight.value = "";
    }
}
maintainWidthInPx.addEventListener('input', () => {
    disable({ maintainWidthInPer, customWidth, customHeight })
    if (maintainWidthInPx.value > 10000) {
        maintainWidthInPx.value = 10000;
    }
})
maintainWidthInPer.addEventListener('input', () => {
    disable({ maintainWidthInPx, customWidth, customHeight })
    if (maintainWidthInPer.value > 100) {
        maintainWidthInPer.value = 100;
    }
})
customWidth.addEventListener('input', () => {
    disable({ maintainWidthInPer, maintainWidthInPx })
    if (customWidth.value > 10000) {
        customWidth.value = 10000;
    }
})
customHeight.addEventListener('input', () => {
    disable({ maintainWidthInPer, maintainWidthInPx })
    if (customHeight.value > 10000) {
        customHeight.value = 10000;
    }
})

let invalidChars = ["-", "e"];

maintainWidthInPx.addEventListener("keydown", function (e) {
    if (invalidChars.includes(e.key)) {
        e.preventDefault();
    }
});
maintainWidthInPer.addEventListener("keydown", function (e) {
    if (invalidChars.includes(e.key)) {
        e.preventDefault();
    }
});
customWidth.addEventListener("keydown", function (e) {
    if (invalidChars.includes(e.key)) {
        e.preventDefault();
    }
});
customHeight.addEventListener("keydown", function (e) {
    if (invalidChars.includes(e.key)) {
        e.preventDefault();
    }
});

function convertFunc() {
    if ((customHeight.value == "" && customWidth.value == "") || (customHeight.value != "" && customWidth.value != "")) {
        console.log(window.actualImage)
        console.log("Convert function executed!!!")
        document.querySelectorAll('.show')[0].innerHTML = window.actualImage.name + " ( Size: " + JSON.stringify(Math.floor(window.actualImage.size / 1024)) + "KB )"
        let reader = new FileReader;
        reader.readAsDataURL(window.actualImage)
        reader.onload = (e) => {
            console.log('h', e)
            let imageUrl = e.target.result;
            let imageElement = document.createElement('img');
            imageElement.src = imageUrl;
            imageElement.onload = (e) => {
                let canvasElement = document.createElement('canvas');
                if (maintainWidthInPx.value != "" && customWidth.value != "" && customHeight.value != "" && maintainWidthInPer.value != "") {
                    maintainWidthInPer.value = "";
                    maintainWidthInPx.value = ""
                }

                if (maintainWidthInPx.value != "") {
                    const width = parseInt(maintainWidthInPx.value);
                    let ratio = width / e.target.width;
                    const height = e.target.height * ratio;
                    canvasElement.width = width;
                    canvasElement.height = height;
                }
                else if (maintainWidthInPer.value != "") {
                    const width = parseInt(maintainWidthInPer.value) / 100 * e.target.width;
                    let ratio = width / e.target.width;
                    const height = e.target.height * ratio;
                    canvasElement.width = width;
                    canvasElement.height = height;
                }
                else if (customHeight.value != "" && customHeight.value != "") {
                    const width = parseInt(customWidth.value);
                    const height = parseInt(customHeight.value);
                    canvasElement.width = width;
                    canvasElement.height = height;
                }
                else {
                    const width = e.target.width;
                    let ratio = width / e.target.width;
                    const height = e.target.height * ratio;
                    canvasElement.width = width;
                    canvasElement.height = height;
                }
                // maintainWidthInPx.value = e.target.width;
                // console.log(imageElement.width)
                // canvasElement.width = width;
                // canvasElement.height = height;
                // console.log('Ratio', ratio, 'height', e.target.height * ratio)

                let context = canvasElement.getContext('2d');
                console.log(context)
                context.drawImage(imageElement, 0, 0, canvasElement.width, canvasElement.height);
                let newimageUrl = context.canvas.toDataURL();
                // imageElement.src = newimageUrl;
                // imgDiv.appendChild(imageElement);
                // download.setAttribute('href', newimageUrl);
                imageElement.onload = null;

                canvasElement.toBlob(function (blob) {
                    fetch(newimageUrl)
                        .then(response => response.blob())
                        .then(blob => {
                            console.log('actualImage', window.actualImage)
                            let file = new File([blob], `${window.actualImage.name.slice(0, -4)}`, { type: `image/${type.value}` });
                            console.log('blob', [blob])
                            console.log(file)
                            // let f = file.files[0]
                            let rea = new FileReader;
                            rea.readAsDataURL(file)
                            rea.onload = (e) => {
                                let u = e.target.result;
                                imageElement.src = u;
                                imgDiv.appendChild(imageElement)
                                download.setAttribute('download', `${window.actualImage.name.slice(0, -4)}`);
                                download.setAttribute('href', u);
                                download.style.visibility = "initial";
                            }
                            // window.location = URL.createObjectURL(file);
                            console.log(URL.createObjectURL(file));
                        });
                });  // mime=JPEG, quality=0.75  , "image/jpeg", 1.00
            }
        }
    }
    else {
        alert('Enter both values!')
    }
}

input.addEventListener('change', (e) => {
    window.actualImage = e.target.files[0];
    console.log(e.target.files)
    document.querySelectorAll('.show')[0].innerHTML = window.actualImage.name + " ( Size: " + JSON.stringify(Math.floor(window.actualImage.size / 1024)) + "KB )"
    let reader = new FileReader;
    reader.readAsDataURL(window.actualImage)
    reader.onload = (e) => {
        console.log('h', e)
        let imageUrl = e.target.result;
        let imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        imageElement.onload = (e) => {
            document.querySelector('#preview').appendChild(imageElement)
            maintainWidthInPx.value = e.target.width;
            maintainWidthInPer.value = 100;
            customWidth.value = e.target.width;
            customHeight.value = e.target.height;
        }
        imageElement.remove();
    }
    convert.addEventListener('click', convertFunc)
})



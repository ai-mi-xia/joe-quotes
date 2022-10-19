let starsAnimation;
let myFunction;

window.addEventListener('load', function () {
    console.log('page is loaded')

    let enterButton = document.getElementById('enter-button');
    let universeText = document.getElementById('universe-text');
    let quoteText = document.getElementById('quote-text');
    let meditationText = document.getElementById('meditation-text');
    let refreshButton = document.getElementById('refresh-button');
    let quotesRefresh = document.getElementById('quote-refresh');
    let meditationRefresh = document.getElementById('meditation-refresh');
    let meditationName = document.getElementById('meditation-name');
    let errorMsg = document.getElementById('error-msg');
    let nameElement3 = document.getElementById('url-id');
    let meditationString;


    quoteText.style.display = "none";
    universeText.style.display = "none";
    meditationText.style.display = "none";
    refreshButton.style.display = "none";


    enterButton.addEventListener('click', function () {

        //boolean for star animation on click
        starsAnimation = true;

        fetch('joequotes.json')

            .then(response => response.json())

            .then(data => {

                //Getting random quote
                let quotesArray = data.quotes
                let randomNumber = Math.floor(Math.random() * quotesArray.length);
                let nameElement = document.getElementById('quote-name');
                nameElement.innerHTML = data.quotes[randomNumber].quote

                //Getting random meditation 
                let meditationsArray = data.meditations
                let randomNumber2 = Math.floor(Math.random() * meditationsArray.length);
                let nameElement2 = document.getElementById('meditation-name');
                meditationString = data.meditations[randomNumber2].meditation
                nameElement2.innerHTML = meditationString
                console.log(meditationString)

                if (meditationString == "Walking Meditation 9: Noble Walk" || meditationString == "Walking Meditation 10: A Heart-Full Mind, Mind-Full Heart" || meditationString == "Walking Meditation 11: Body Electric" || meditationString == "Walking Meditation 12: Walk in Radiant Light") {
                    console.log("hi")
                }

                //Getting URL from json
                let nameElement3 = document.getElementById('url-id');
                nameElement3.href = data.meditations[randomNumber2].url

            })

            .catch(error => {
                console.log("Error:" + error);
            })

        enterButton.style.display = "none";
        universeText.style.display = "block";
        quoteText.style.display = "block";
        meditationText.style.display = "block";
        refreshButton.style.display = "block";
    })

    //Getting a new quote when clicking on "message" button
    quotesRefresh.addEventListener('click', function () {

        fetch('joequotes.json')

            .then(response => response.json())

            .then(data => {
                let joequotesArray = data.quotes
                let randomNumber = Math.floor(Math.random() * joequotesArray.length); //do i need to change this?
                let nameElement = document.getElementById('quote-name');
                nameElement.innerHTML = data.quotes[randomNumber].quote
            })

            .catch(error => {
                console.log("Error:" + error);
            })
    })

    //Getting a new meditation & URL when clicking on "meditation" button
    meditationRefresh.addEventListener('click', function () {

        fetch('joequotes.json')

            .then(response => response.json())

            .then(data => {
                let meditationsArray = data.meditations
                let randomNumber2 = Math.floor(Math.random() * meditationsArray.length);
                let nameElement2 = document.getElementById('meditation-name');
                meditationString = data.meditations[randomNumber2].meditation
                nameElement2.innerHTML = meditationString
                console.log(meditationString)


                nameElement3.href = data.meditations[randomNumber2].url
                errorMsg.innerHTML = ""

            })

            .catch(error => {
                console.log("Error:" + error);
            })
    })

    nameElement3.addEventListener('click', function (event) {
        event.preventDefault(); //stops the event
        console.log("afterpreventdefault")
        if (meditationString == "Walking Meditation 9: Noble Walk" || meditationString == "Walking Meditation 10: A Heart-Full Mind, Mind-Full Heart" || meditationString == "Walking Meditation 11: Body Electric" || meditationString == "Walking Meditation 12: Walk in Radiant Light") {
            errorMsg.innerHTML = "This meditation is not available on the website"
            console.log("ifstatement")
        }
        else {
            errorMsg.innerHTML = ""
            nameElement3.style.pointerEvents = "auto"
            console.log("running")
            window.open(nameElement3.href, '_blank');
        }

    })

})

//THREE.JS STARS!!!!!
let scene, camera, renderer, stars, starGeo, count, speed;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000); //PerspectiveCamera( fov, aspect, near, far)
    camera.position.z = 5

    //basically boiler plate code for the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    count = 500
    starGeo = new THREE.BufferGeometry(); //buffer geometry is used for custom shapes
    let positions = new Float32Array(count * 3) //you must set the size of Float32Arrays
    //if we want 500 stars, each star will need an x,y,z position, hence count * 3. Then in the positions array, we assign random numbers
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 9 //-0.5 to center in the canvas, 9 for scale
    }

    //this is the same for all buffer attributes 
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    //material for the points     
    let sprite = new THREE.TextureLoader().load('particles/1.png');
    let starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        sizeAttenuation: true,
        alphaMap: sprite,
        transparent: true,
        alphaTest: 0.001,
        depthWrite: false,
        blending: THREE.AdditiveBlending,

    });

    //combining the geometry and the material
    stars = new THREE.Points(starGeo, starMaterial);

    scene.add(stars);
    animate();
}

//IF the button has been pressed, run the animation
//FOR loop - identifying the "z" value in the array, and incrementing that for forwards animation
//IF the z position of the stars is greater than 5 (z camera position), move backwards 
function animate() {
    requestAnimationFrame(animate);
    if (starsAnimation == true) {
        stars.rotation.z += 0.01;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            //trying to ease in the animation but it looks the same :(
            speed = 0.01
            speed += 1;

            stars.geometry.attributes.position.array[i3 + 2] += Math.pow(0.07, speed);

            if (stars.geometry.attributes.position.array[i3 + 2] > 5) {
                stars.geometry.attributes.position.array[i3 + 2] = (Math.random() - 1) * 50
            }
        }
        stars.geometry.attributes.position.needsUpdate = true //this needs to be included in buffer geometry
    }

    renderer.render(scene, camera);
}

init();
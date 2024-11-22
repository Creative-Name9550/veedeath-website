
var fishMarkerMove = 0;
var hitPosition = 0
var catchProgress = 0;
var catchTime = 0
var fishing = false

var fishingInterval;

var fishDB = [
    {
        "Name":"Test",
        "Description":"Testing Fish",
        "Catch Requirement":4,
        "Catch Timer": 12,
        "Image":"assets/Raw_Salmon_JE2_BE2.png"
    }
]


var baitPools = {
    "nobait": [
        {
            "rarity":10,
            "fish":[
                "Test"
            ],
        },
        {
            "rarity":20,
            "fish":[
                "Test"
            ],
        },
        {
            "rarity":30,
            "fish":[
                "Test"
            ],
        },
        {
            "rarity":40,
            "fish":[
                "Test"
            ],
        }
    ]
}

var currentBait = "nobait"
var currentFishId = 0;

function print(message) {
    console.log(message)
    $("#debug").html(message + "<hr>"+$("#debug").html())
    $("#debug").show()
}

function startCatchingFish() {
    $("#fishing-minigame").show()
    $("#catch").hide()
    fishMarkerMove = 0
    catchProgress = 0
    catchTime = 0
    fishing = true
    fishingInterval = setInterval(() => {
        // var a = checkHit()
        // if (a == -1) {
        //     fishMarkerMove += 0.004
        // }
        fishMarkerMove += 0.005
        $(".fishing-marker").css("left","calc(50% + "+(Math.sin(Math.PI * fishMarkerMove)*50)+"% - 30px)")
        // $(".fishing-marker .debug").text(checkHit())
        
        if (catchProgress > 0) catchProgress -= 0.001
        
        catchTime += 0.01
        if (catchTime >= fishDB[currentFishId]["Catch Timer"]) stopCatchingFish(false)
    }, 10)
    moveFishMarker()
}
function stopCatchingFish(won) {
    if (!won) alert("failed")
    $("#fishing-minigame").hide()
    fishing = false
    clearInterval(fishingInterval)
}
function succeedCatchingFish() {
    alert("caught fish "+fishDB[currentFishId].Name)
    $("#catch").show()
    $("#catch .fish").attr("src",fishDB[currentFishId].Image)
    stopCatchingFish(true)
}
function moveFishMarker() {
    hitPosition = Math.floor(Math.random()*90)
    $('.fishing-hit').css("left",hitPosition+"%")
    hitPosition = hitPosition/100
}
function checkHit() {
    var hitCheck = (50 +(Math.sin(Math.PI * fishMarkerMove)*50))/100
    if (hitCheck > hitPosition && hitCheck < hitPosition+0.1) {
        var hitCenter = hitPosition + 0.05
        var centerDistance = 1-Math.abs(hitCheck-hitCenter)/0.05
        return Math.floor(centerDistance*5)
    } else {
        return -1
    }
}

function checkBait() {
    var fishNames = []
    for (var i in fishDB) {
        fishNames.push(fishDB[i].Name)
    }
    for (var bait in baitPools) {
        total = 0
        poolData = baitPools[bait]
        for (var i in poolData) {
            total += poolData[i].rarity
            if (poolData[i].fish.length == 0) {
                print("no fish in bait pool " + bait + " at index " + i)
            }
            for (var y in poolData[i].fish) {
                if (fishNames.indexOf(poolData[i].fish[y]) == -1) print("incorrect fish for "+bait+" at index "+i+" for fish "+poolData[i].fish[y]+" (index"+y+")")
            }
        }
        if (total != 100) {
            print("incorrect rarity total for "+bait+ ": "+total+" (100 expected)")
        }
    }
}

var r = 0
$(document).ready(function(){
    $("#fishing-minigame").hide()
    $("#catch").hide()
    $("#debug").hide()
    $("#debug").on("click",() => {
        $("#debug").hide()
    })
    checkBait()
    setInterval(() => {
        r += 0.01
        $(".rays").css("transform","rotate("+(r * 15)+"deg)")
        //print(r)
    },10)

    $(document).on("keypress",(event) => {
        if (event.code == "Space") {
            if (fishing) {
                var hitCount = checkHit()
                catchProgress += hitCount
                if (hitCount > -1) moveFishMarker()
                if (catchProgress < -3) stopCatchingFish(false)
                if (catchProgress >= fishDB[currentFishId]["Catch Requirement"]) succeedCatchingFish()
            } else {

            }
        }
        if (event.code == "KeyR") {
            if (!fishing) {
                startCatchingFish()
            }
        }
    })
})
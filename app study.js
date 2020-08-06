const canvas = document.getElementById("jsCanvas");
// html의 canvas는 context 갖고 있는 html 요소임으로
// 즉, 픽셀에 접근하고 getContext 메서드를 통해 다룰 수 있다. (mdn 참조)
const ctx = canvas.getContext("2d");
// 같은 이름에 클래스가 여러개이면 유사배열 형태로 넘어온다.
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
// mode 변경, save 버튼
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");

// canvas를 css가 아닌 element로 다루기에
// canvas element 사이즈 지정
const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;

// 초기값 설정 (색상 및 선너비)
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// 배경 기본색상을 지정하지 않으면 투명으로 된다.
ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

function onMouseMove(event) {
    // clinetX, clientY는 스크린 전체의 좌표
    // offset은 해당 타겟 안에서의 좌표
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
        // 2d canvas 메서드는 mdn 참조!!
        // 클릭하지 않은 상태에서는 계속 path이 만들어지고 있다
        ctx.beginPath();
        // 클릭하기 직전 마지막 점 (선의 시작점)
        ctx.moveTo(x, y);
    } else {
        // 시작점(sub-path)에서 x,y점을 연결 (선이 만들어진다)
        // 마우스를 움직이는 동안(onMouseMove 이벤트가 계속 발생하여 해당 함수가 계속 호출)
        ctx.lineTo(x, y);
        // 현재의 stroke style로 획을 그음
        ctx.stroke();
    }
}

function handleColorClick(event) {
    // 해당 colors 클래스를 클릭하면 그 클래스의 css 배경색상을 color 변수에 담는다.
    const color = event.target.style.backgroundColor;
    // 해당 컬러를 선색상과 fill색상으로 선언
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function handleRangeChange(event) {
    // range의 value값
    const size = event.target.value;
    // 선너비 조절 선언
    ctx.lineWidth = size;
}

// 클릭시 버튼 변환하는 함수
function handleModeClick() {
    if (filling === true) {
        filling = false;
        mode.innerText = "NOW : Paint";
    } else {
        filling = true;
        mode.innerText = "NOW : Fill";
    }
}

function handleCanvasClick() {
    if (filling) {
        // fullRect 메서드 활용하여 전체 채우기 좌표 설정
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
}

function handleCM(event) {
    // 해당 이벤트 발생시키지 않기
    event.preventDefault();
}

function handleSaveClick() {
    // canvas는 저장 메서드를 가지고 있다. (mdn 검색)
    // 해당 이미지를 URL 주소로 만들어줌
    // 매개변수로 이미지 타입도 정할 수 있다. (기본은  png)
    const image = canvas.toDataURL();
    const link = document.createElement("a");
    // href, download는 html a 태그가 가지고 있는 속성
    // href 주소에 image를 설정하고
    link.href = image;
    // 다운로드 할때 기본파일명 설정
    link.download = "완성 이미지 파일";
    link.click();
}

if (canvas) {
    // 마우스 움직임 감지하여 이벤트 발생
    canvas.addEventListener("mousemove", onMouseMove);
    // 마우스를 클릭하였을 때
    canvas.addEventListener("mousedown", startPainting);
    // 마우스를 떼었을 때
    canvas.addEventListener("mouseup", stopPainting);
    // 마우스가 캔버스에서 떠났을 때
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    // 우측버튼 메뉴
    canvas.addEventListener("contextmenu", handleCM);
}

// colors 클래스가 여러개여서 유사배열형태로 넘어오기에 배열화 시켜준다.
// forEach를 써서 배열안 모든 값에(각각의 클래스에) addEventListener 메서드를 호출한다.
Array.from(colors).forEach(item =>
    item.addEventListener("click", handleColorClick)
);

if (range) {
    // range를 움직여서 range의 value값을 넣어주는 거니 input 이벤트
    range.addEventListener("input", handleRangeChange);
}

if (mode) {
    mode.addEventListener("click", handleModeClick);
}

if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
}

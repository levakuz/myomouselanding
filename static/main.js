var scroll = new SmoothScroll('a[href*="#"]', {
	speed: 800
});
const form = document.getElementById('form');
console.log(form)
const mobile_form = document.getElementById('mobile_form');

async function send_form_data(){
	let name
	let phone
	let email
	console.log(window.screen.width )
	if (window.screen.width >= 1024){
		name = document.getElementById('name')
		phone = document.getElementById('phone')
		email = document.getElementById('email')
	}
	else{
		name = document.getElementById('name_mobile')
		phone = document.getElementById('phone_mobile')
		email = document.getElementById('email_mobile')
	}
	fetch('http://localhost:8000/form_data', {
		method: 'POST',
		body: JSON.stringify({name:name.value, phone: phone.value, email: email.value}),
		headers: {'Content-Type': 'application/json;charset=utf-8'}
	})
}
// const html = document.documentElement;
// const canvas = document.getElementById("hero-lightpass");
// const canvas_wrapper = document.getElementById("canvas-wrapper");
// const context = canvas.getContext("2d");
//
// // const frameCount = 148;
// // const currentFrame = index => (
// //   `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${index.toString().padStart(4, '0')}.jpg`
// // )
// //
// // const preloadImages = () => {
// //   for (let i = 1; i < frameCount; i++) {
// //     const img = new Image();
// //     img.src = currentFrame(i);
// //   }
// // };
// //
// // const img = new Image()
// // img.src = currentFrame(1);
// // canvas.width=1158;
// // canvas.height=770;
// // img.onload=function(){
// //   context.drawImage(img, 0, 0);
// // }
// //
// // const updateImage = index => {
// //   img.src = currentFrame(index);
// //   context.drawImage(img, 0, 0);
// // }
// //
// // window.addEventListener('scroll', () => {
// //   const scrollTop = html.scrollTop;
// //   const maxScrollTop = html.scrollHeight - window.innerHeight;
// //   const scrollFraction = scrollTop / maxScrollTop;
// //   const frameIndex = Math.min(
// //     frameCount - 1,
// //     Math.ceil(scrollFraction*2 * frameCount)
// //   );
// //   console.log(frameIndex)
// //   if (frameIndex !== 147) {
// //     canvas.classList.add("fixed-canvas");
// // 	requestAnimationFrame(() => updateImage(frameIndex + 1))
// //   } else {
// // 	  canvas.classList.remove("fixed-canvas");
// //   }
// //
// // });

// preloadImages()
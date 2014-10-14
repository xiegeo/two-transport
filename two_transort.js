function encrypt(){
	try{
		var plainText = id("et").value;
		var pBytes = (new StringView(plainText)).buffer;
		var randomPad = getRandomPad(pBytes.byteLength);
		var rPadText = StringView.bytesToBase64(randomPad);
		var xoredBytes = xorTypedArrays(pBytes, randomPad.buffer);
		var xoredText = StringView.bytesToBase64(new Uint8Array(xoredBytes));
		id("e1").value = "base64:" + rPadText;
		id("e2").value = "base64:" + xoredText;
		log("finish encrypt");
	}catch(e){
		id("e1").value = e;
		id("e2").value = e.stack;
	}
}

function decrypt(){
	try{
		var c1 = codeToByte(id("d1").value);
		var c2 = codeToByte(id("d2").value);
		if (c1.byteLength != c2.byteLength){
			id("dt").value = "Error: Cipher text length mismatch.";
			return;
		}
		var plainBytes = xorTypedArrays(c1, c2);
		id("dt").value = new StringView(plainBytes).toString();
		log("finish decrypt");
	}catch(e){
		id("dt").value = e+"\n"+e.stack;
	}
}

function codeToByte(codeString){
	var dataSA = codeString.split(":");
	var dataS = dataSA[dataSA.length - 1];
	return StringView.base64ToBytes(dataS).buffer;
}

function getRandomPad(length){
	var pad = new Uint8Array(length);
	if (window.crypto && window.crypto.getRandomValues) {
		window.crypto.getRandomValues(pad);
		return pad;
	}else{
		throw new Error("Browser not supported: need window.crypto.getRandomValues");
	}
}

function xorTypedArrays(a, b){
	if (a.byteLength != b.byteLength){
		throw new Error("xor is only supported on arrays of the same size");
	}
	var l = a.byteLength;
	var va = new Uint8Array(a);
	var vb = new Uint8Array(b);
	var out = new Uint8Array(l);
	for(var i = 0; i < l; i++){
		out[i] = va[i] ^ vb[i];
	}
	return out.buffer;
}

//ui helper functions
function id(elementId){
	return document.getElementById(elementId);
}

function onInput(element, listener){
	if(element.addEventListener){
		element.addEventListener("input", listener);
	}else{
		log("need alternative");
	}
}

//debugging
function log(msg){
	console.log(msg);
}

//setup
log("log is on");
onInput(id("et"), encrypt);
encrypt();
onInput(id("d1"), decrypt);
onInput(id("d2"), decrypt);
decrypt();
"use strict";(self.webpackChunkgallery=self.webpackChunkgallery||[]).push([[360],{3151:(t,e,n)=>{n.d(e,{z:()=>u});var o=n(4599);const a={type:"change"},i={type:"start"},r={type:"end"},s=new o.zHn,c=new o.JOQ,l=Math.cos(70*o.M8C.DEG2RAD);class u extends o.pBf{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new o.Pa4,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:o.RsA.ROTATE,MIDDLE:o.RsA.DOLLY,RIGHT:o.RsA.PAN},this.touches={ONE:o.QmN.ROTATE,TWO:o.QmN.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return p.phi},this.getAzimuthalAngle=function(){return p.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(t){t.addEventListener("keydown",$),this._domElementKeyEvents=t},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",$),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(a),n.update(),m=u.NONE},this.update=function(){const e=new o.Pa4,i=(new o._fP).setFromUnitVectors(t.up,new o.Pa4(0,1,0)),r=i.clone().invert(),g=new o.Pa4,b=new o._fP,y=new o.Pa4,x=2*Math.PI;return function(){let E=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;const w=n.object.position;e.copy(w).sub(n.target),e.applyQuaternion(i),p.setFromVector3(e),n.autoRotate&&m===u.NONE&&R(function(t){return null!==t?2*Math.PI/60*n.autoRotateSpeed*t:2*Math.PI/60/60*n.autoRotateSpeed}(E)),n.enableDamping?(p.theta+=h.theta*n.dampingFactor,p.phi+=h.phi*n.dampingFactor):(p.theta+=h.theta,p.phi+=h.phi);let P=n.minAzimuthAngle,M=n.maxAzimuthAngle;isFinite(P)&&isFinite(M)&&(P<-Math.PI?P+=x:P>Math.PI&&(P-=x),M<-Math.PI?M+=x:M>Math.PI&&(M-=x),p.theta=P<=M?Math.max(P,Math.min(M,p.theta)):p.theta>(P+M)/2?Math.max(P,p.theta):Math.min(M,p.theta)),p.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,p.phi)),p.makeSafe(),!0===n.enableDamping?n.target.addScaledVector(v,n.dampingFactor):n.target.add(v),n.zoomToCursor&&O||n.object.isOrthographicCamera?p.radius=Y(p.radius):p.radius=Y(p.radius*f),e.setFromSpherical(p),e.applyQuaternion(r),w.copy(n.target).add(e),n.object.lookAt(n.target),!0===n.enableDamping?(h.theta*=1-n.dampingFactor,h.phi*=1-n.dampingFactor,v.multiplyScalar(1-n.dampingFactor)):(h.set(0,0,0),v.set(0,0,0));let S=!1;if(n.zoomToCursor&&O){let a=null;if(n.object.isPerspectiveCamera){const t=e.length();a=Y(t*f);const o=t-a;n.object.position.addScaledVector(T,o),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const t=new o.Pa4(C.x,C.y,0);t.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/f)),n.object.updateProjectionMatrix(),S=!0;const i=new o.Pa4(C.x,C.y,0);i.unproject(n.object),n.object.position.sub(i).add(t),n.object.updateMatrixWorld(),a=e.length()}else n.zoomToCursor=!1;null!==a&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(a).add(n.object.position):(s.origin.copy(n.object.position),s.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(s.direction))<l?t.lookAt(n.target):(c.setFromNormalAndCoplanarPoint(n.object.up,n.target),s.intersectPlane(c,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/f)),n.object.updateProjectionMatrix(),S=!0);return f=1,O=!1,!!(S||g.distanceToSquared(n.object.position)>d||8*(1-b.dot(n.object.quaternion))>d||y.distanceToSquared(n.target)>0)&&(n.dispatchEvent(a),g.copy(n.object.position),b.copy(n.object.quaternion),y.copy(n.target),S=!1,!0)}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",tt),n.domElement.removeEventListener("pointerdown",G),n.domElement.removeEventListener("pointercancel",q),n.domElement.removeEventListener("wheel",J),n.domElement.removeEventListener("pointermove",Q),n.domElement.removeEventListener("pointerup",q),null!==n._domElementKeyEvents&&(n._domElementKeyEvents.removeEventListener("keydown",$),n._domElementKeyEvents=null)};const n=this,u={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let m=u.NONE;const d=1e-6,p=new o.$V,h=new o.$V;let f=1;const v=new o.Pa4,g=new o.FM8,b=new o.FM8,y=new o.FM8,x=new o.FM8,E=new o.FM8,w=new o.FM8,P=new o.FM8,M=new o.FM8,S=new o.FM8,T=new o.Pa4,C=new o.FM8;let O=!1;const L=[],A={};function j(){return Math.pow(.95,n.zoomSpeed)}function R(t){h.theta-=t}function _(t){h.phi-=t}const D=function(){const t=new o.Pa4;return function(e,n){t.setFromMatrixColumn(n,0),t.multiplyScalar(-e),v.add(t)}}(),N=function(){const t=new o.Pa4;return function(e,o){!0===n.screenSpacePanning?t.setFromMatrixColumn(o,1):(t.setFromMatrixColumn(o,0),t.crossVectors(n.object.up,t)),t.multiplyScalar(e),v.add(t)}}(),z=function(){const t=new o.Pa4;return function(e,o){const a=n.domElement;if(n.object.isPerspectiveCamera){const i=n.object.position;t.copy(i).sub(n.target);let r=t.length();r*=Math.tan(n.object.fov/2*Math.PI/180),D(2*e*r/a.clientHeight,n.object.matrix),N(2*o*r/a.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(D(e*(n.object.right-n.object.left)/n.object.zoom/a.clientWidth,n.object.matrix),N(o*(n.object.top-n.object.bottom)/n.object.zoom/a.clientHeight,n.object.matrix)):n.enablePan=!1}}();function k(t){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?f/=t:n.enableZoom=!1}function I(t){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?f*=t:n.enableZoom=!1}function F(t){if(!n.zoomToCursor)return;O=!0;const e=n.domElement.getBoundingClientRect(),o=t.clientX-e.left,a=t.clientY-e.top,i=e.width,r=e.height;C.x=o/i*2-1,C.y=-a/r*2+1,T.set(C.x,C.y,1).unproject(n.object).sub(n.object.position).normalize()}function Y(t){return Math.max(n.minDistance,Math.min(n.maxDistance,t))}function K(t){g.set(t.clientX,t.clientY)}function H(t){x.set(t.clientX,t.clientY)}function B(){if(1===L.length)g.set(L[0].pageX,L[0].pageY);else{const t=.5*(L[0].pageX+L[1].pageX),e=.5*(L[0].pageY+L[1].pageY);g.set(t,e)}}function Z(){if(1===L.length)x.set(L[0].pageX,L[0].pageY);else{const t=.5*(L[0].pageX+L[1].pageX),e=.5*(L[0].pageY+L[1].pageY);x.set(t,e)}}function U(){const t=L[0].pageX-L[1].pageX,e=L[0].pageY-L[1].pageY,n=Math.sqrt(t*t+e*e);P.set(0,n)}function X(t){if(1==L.length)b.set(t.pageX,t.pageY);else{const e=nt(t),n=.5*(t.pageX+e.x),o=.5*(t.pageY+e.y);b.set(n,o)}y.subVectors(b,g).multiplyScalar(n.rotateSpeed);const e=n.domElement;R(2*Math.PI*y.x/e.clientHeight),_(2*Math.PI*y.y/e.clientHeight),g.copy(b)}function W(t){if(1===L.length)E.set(t.pageX,t.pageY);else{const e=nt(t),n=.5*(t.pageX+e.x),o=.5*(t.pageY+e.y);E.set(n,o)}w.subVectors(E,x).multiplyScalar(n.panSpeed),z(w.x,w.y),x.copy(E)}function V(t){const e=nt(t),o=t.pageX-e.x,a=t.pageY-e.y,i=Math.sqrt(o*o+a*a);M.set(0,i),S.set(0,Math.pow(M.y/P.y,n.zoomSpeed)),k(S.y),P.copy(M)}function G(t){!1!==n.enabled&&(0===L.length&&(n.domElement.setPointerCapture(t.pointerId),n.domElement.addEventListener("pointermove",Q),n.domElement.addEventListener("pointerup",q)),function(t){L.push(t)}(t),"touch"===t.pointerType?function(t){switch(et(t),L.length){case 1:switch(n.touches.ONE){case o.QmN.ROTATE:if(!1===n.enableRotate)return;B(),m=u.TOUCH_ROTATE;break;case o.QmN.PAN:if(!1===n.enablePan)return;Z(),m=u.TOUCH_PAN;break;default:m=u.NONE}break;case 2:switch(n.touches.TWO){case o.QmN.DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;n.enableZoom&&U(),n.enablePan&&Z(),m=u.TOUCH_DOLLY_PAN;break;case o.QmN.DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;n.enableZoom&&U(),n.enableRotate&&B(),m=u.TOUCH_DOLLY_ROTATE;break;default:m=u.NONE}break;default:m=u.NONE}m!==u.NONE&&n.dispatchEvent(i)}(t):function(t){let e;switch(t.button){case 0:e=n.mouseButtons.LEFT;break;case 1:e=n.mouseButtons.MIDDLE;break;case 2:e=n.mouseButtons.RIGHT;break;default:e=-1}switch(e){case o.RsA.DOLLY:if(!1===n.enableZoom)return;!function(t){F(t),P.set(t.clientX,t.clientY)}(t),m=u.DOLLY;break;case o.RsA.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(!1===n.enablePan)return;H(t),m=u.PAN}else{if(!1===n.enableRotate)return;K(t),m=u.ROTATE}break;case o.RsA.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(!1===n.enableRotate)return;K(t),m=u.ROTATE}else{if(!1===n.enablePan)return;H(t),m=u.PAN}break;default:m=u.NONE}m!==u.NONE&&n.dispatchEvent(i)}(t))}function Q(t){!1!==n.enabled&&("touch"===t.pointerType?function(t){switch(et(t),m){case u.TOUCH_ROTATE:if(!1===n.enableRotate)return;X(t),n.update();break;case u.TOUCH_PAN:if(!1===n.enablePan)return;W(t),n.update();break;case u.TOUCH_DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;!function(t){n.enableZoom&&V(t),n.enablePan&&W(t)}(t),n.update();break;case u.TOUCH_DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;!function(t){n.enableZoom&&V(t),n.enableRotate&&X(t)}(t),n.update();break;default:m=u.NONE}}(t):function(t){switch(m){case u.ROTATE:if(!1===n.enableRotate)return;!function(t){b.set(t.clientX,t.clientY),y.subVectors(b,g).multiplyScalar(n.rotateSpeed);const e=n.domElement;R(2*Math.PI*y.x/e.clientHeight),_(2*Math.PI*y.y/e.clientHeight),g.copy(b),n.update()}(t);break;case u.DOLLY:if(!1===n.enableZoom)return;!function(t){M.set(t.clientX,t.clientY),S.subVectors(M,P),S.y>0?k(j()):S.y<0&&I(j()),P.copy(M),n.update()}(t);break;case u.PAN:if(!1===n.enablePan)return;!function(t){E.set(t.clientX,t.clientY),w.subVectors(E,x).multiplyScalar(n.panSpeed),z(w.x,w.y),x.copy(E),n.update()}(t)}}(t))}function q(t){!function(t){delete A[t.pointerId];for(let e=0;e<L.length;e++)if(L[e].pointerId==t.pointerId)return void L.splice(e,1)}(t),0===L.length&&(n.domElement.releasePointerCapture(t.pointerId),n.domElement.removeEventListener("pointermove",Q),n.domElement.removeEventListener("pointerup",q)),n.dispatchEvent(r),m=u.NONE}function J(t){!1!==n.enabled&&!1!==n.enableZoom&&m===u.NONE&&(t.preventDefault(),n.dispatchEvent(i),function(t){F(t),t.deltaY<0?I(j()):t.deltaY>0&&k(j()),n.update()}(t),n.dispatchEvent(r))}function $(t){!1!==n.enabled&&!1!==n.enablePan&&function(t){let e=!1;switch(t.code){case n.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?_(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):z(0,n.keyPanSpeed),e=!0;break;case n.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?_(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):z(0,-n.keyPanSpeed),e=!0;break;case n.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?R(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):z(n.keyPanSpeed,0),e=!0;break;case n.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?R(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):z(-n.keyPanSpeed,0),e=!0}e&&(t.preventDefault(),n.update())}(t)}function tt(t){!1!==n.enabled&&t.preventDefault()}function et(t){let e=A[t.pointerId];void 0===e&&(e=new o.FM8,A[t.pointerId]=e),e.set(t.pageX,t.pageY)}function nt(t){const e=t.pointerId===L[0].pointerId?L[1]:L[0];return A[e.pointerId]}n.domElement.addEventListener("contextmenu",tt),n.domElement.addEventListener("pointerdown",G),n.domElement.addEventListener("pointercancel",q),n.domElement.addEventListener("wheel",J,{passive:!1}),this.update()}}},8091:(t,e,n)=>{n.d(e,{q:()=>a});var o=n(4599);class a extends o.Kj0{constructor(){const t=a.SkyShader,e=new o.jyz({name:"SkyShader",fragmentShader:t.fragmentShader,vertexShader:t.vertexShader,uniforms:o.rDY.clone(t.uniforms),side:o._Li,depthWrite:!1});super(new o.DvJ(1,1,1),e),this.isSky=!0}}a.SkyShader={uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new o.Pa4},up:{value:new o.Pa4(0,1,0)}},vertexShader:"\n\t\tuniform vec3 sunPosition;\n\t\tuniform float rayleigh;\n\t\tuniform float turbidity;\n\t\tuniform float mieCoefficient;\n\t\tuniform vec3 up;\n\n\t\tvarying vec3 vWorldPosition;\n\t\tvarying vec3 vSunDirection;\n\t\tvarying float vSunfade;\n\t\tvarying vec3 vBetaR;\n\t\tvarying vec3 vBetaM;\n\t\tvarying float vSunE;\n\n\t\t// constants for atmospheric scattering\n\t\tconst float e = 2.71828182845904523536028747135266249775724709369995957;\n\t\tconst float pi = 3.141592653589793238462643383279502884197169;\n\n\t\t// wavelength of used primaries, according to preetham\n\t\tconst vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );\n\t\t// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:\n\t\t// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))\n\t\tconst vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );\n\n\t\t// mie stuff\n\t\t// K coefficient for the primaries\n\t\tconst float v = 4.0;\n\t\tconst vec3 K = vec3( 0.686, 0.678, 0.666 );\n\t\t// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K\n\t\tconst vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );\n\n\t\t// earth shadow hack\n\t\t// cutoffAngle = pi / 1.95;\n\t\tconst float cutoffAngle = 1.6110731556870734;\n\t\tconst float steepness = 1.5;\n\t\tconst float EE = 1000.0;\n\n\t\tfloat sunIntensity( float zenithAngleCos ) {\n\t\t\tzenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );\n\t\t\treturn EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );\n\t\t}\n\n\t\tvec3 totalMie( float T ) {\n\t\t\tfloat c = ( 0.2 * T ) * 10E-18;\n\t\t\treturn 0.434 * c * MieConst;\n\t\t}\n\n\t\tvoid main() {\n\n\t\t\tvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\t\t\tvWorldPosition = worldPosition.xyz;\n\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\tgl_Position.z = gl_Position.w; // set z to camera.far\n\n\t\t\tvSunDirection = normalize( sunPosition );\n\n\t\t\tvSunE = sunIntensity( dot( vSunDirection, up ) );\n\n\t\t\tvSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );\n\n\t\t\tfloat rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );\n\n\t\t\t// extinction (absorbtion + out scattering)\n\t\t\t// rayleigh coefficients\n\t\t\tvBetaR = totalRayleigh * rayleighCoefficient;\n\n\t\t\t// mie coefficients\n\t\t\tvBetaM = totalMie( turbidity ) * mieCoefficient;\n\n\t\t}",fragmentShader:"\n\t\tvarying vec3 vWorldPosition;\n\t\tvarying vec3 vSunDirection;\n\t\tvarying float vSunfade;\n\t\tvarying vec3 vBetaR;\n\t\tvarying vec3 vBetaM;\n\t\tvarying float vSunE;\n\n\t\tuniform float mieDirectionalG;\n\t\tuniform vec3 up;\n\n\t\t// constants for atmospheric scattering\n\t\tconst float pi = 3.141592653589793238462643383279502884197169;\n\n\t\tconst float n = 1.0003; // refractive index of air\n\t\tconst float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)\n\n\t\t// optical length at zenith for molecules\n\t\tconst float rayleighZenithLength = 8.4E3;\n\t\tconst float mieZenithLength = 1.25E3;\n\t\t// 66 arc seconds -> degrees, and the cosine of that\n\t\tconst float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;\n\n\t\t// 3.0 / ( 16.0 * pi )\n\t\tconst float THREE_OVER_SIXTEENPI = 0.05968310365946075;\n\t\t// 1.0 / ( 4.0 * pi )\n\t\tconst float ONE_OVER_FOURPI = 0.07957747154594767;\n\n\t\tfloat rayleighPhase( float cosTheta ) {\n\t\t\treturn THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );\n\t\t}\n\n\t\tfloat hgPhase( float cosTheta, float g ) {\n\t\t\tfloat g2 = pow( g, 2.0 );\n\t\t\tfloat inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );\n\t\t\treturn ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );\n\t\t}\n\n\t\tvoid main() {\n\n\t\t\tvec3 direction = normalize( vWorldPosition - cameraPosition );\n\n\t\t\t// optical length\n\t\t\t// cutoff angle at 90 to avoid singularity in next formula.\n\t\t\tfloat zenithAngle = acos( max( 0.0, dot( up, direction ) ) );\n\t\t\tfloat inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );\n\t\t\tfloat sR = rayleighZenithLength * inverse;\n\t\t\tfloat sM = mieZenithLength * inverse;\n\n\t\t\t// combined extinction factor\n\t\t\tvec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );\n\n\t\t\t// in scattering\n\t\t\tfloat cosTheta = dot( direction, vSunDirection );\n\n\t\t\tfloat rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );\n\t\t\tvec3 betaRTheta = vBetaR * rPhase;\n\n\t\t\tfloat mPhase = hgPhase( cosTheta, mieDirectionalG );\n\t\t\tvec3 betaMTheta = vBetaM * mPhase;\n\n\t\t\tvec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );\n\t\t\tLin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );\n\n\t\t\t// nightsky\n\t\t\tfloat theta = acos( direction.y ); // elevation --\x3e y-axis, [-pi/2, pi/2]\n\t\t\tfloat phi = atan( direction.z, direction.x ); // azimuth --\x3e x-axis [-pi/2, pi/2]\n\t\t\tvec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );\n\t\t\tvec3 L0 = vec3( 0.1 ) * Fex;\n\n\t\t\t// composition + solar disc\n\t\t\tfloat sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );\n\t\t\tL0 += ( vSunE * 19000.0 * Fex ) * sundisk;\n\n\t\t\tvec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );\n\n\t\t\tvec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );\n\n\t\t\tgl_FragColor = vec4( retColor, 1.0 );\n\n\t\t\t#include <tonemapping_fragment>\n\t\t\t#include <colorspace_fragment>\n\n\t\t}"}},5317:(t,e,n)=>{n.d(e,{B:()=>a});var o=n(4599);class a extends o.Kj0{constructor(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};super(t),this.isWater=!0;const n=this,a=void 0!==e.textureWidth?e.textureWidth:512,i=void 0!==e.textureHeight?e.textureHeight:512,r=void 0!==e.clipBias?e.clipBias:0,s=void 0!==e.alpha?e.alpha:1,c=void 0!==e.time?e.time:0,l=void 0!==e.waterNormals?e.waterNormals:null,u=void 0!==e.sunDirection?e.sunDirection:new o.Pa4(.70707,.70707,0),m=new o.Ilk(void 0!==e.sunColor?e.sunColor:16777215),d=new o.Ilk(void 0!==e.waterColor?e.waterColor:8355711),p=void 0!==e.eye?e.eye:new o.Pa4(0,0,0),h=void 0!==e.distortionScale?e.distortionScale:20,f=void 0!==e.side?e.side:o.Wl3,v=void 0!==e.fog&&e.fog,g=new o.JOQ,b=new o.Pa4,y=new o.Pa4,x=new o.Pa4,E=new o.yGw,w=new o.Pa4(0,0,-1),P=new o.Ltg,M=new o.Pa4,S=new o.Pa4,T=new o.Ltg,C=new o.yGw,O=new o.cPb,L=new o.dd2(a,i),A={uniforms:o.rDY.merge([o.rBU.fog,o.rBU.lights,{normalSampler:{value:null},mirrorSampler:{value:null},alpha:{value:1},time:{value:0},size:{value:1},distortionScale:{value:20},textureMatrix:{value:new o.yGw},sunColor:{value:new o.Ilk(8355711)},sunDirection:{value:new o.Pa4(.70707,.70707,0)},eye:{value:new o.Pa4},waterColor:{value:new o.Ilk(5592405)}}]),vertexShader:"\n\t\t\t\tuniform mat4 textureMatrix;\n\t\t\t\tuniform float time;\n\n\t\t\t\tvarying vec4 mirrorCoord;\n\t\t\t\tvarying vec4 worldPosition;\n\n\t\t\t\t#include <common>\n\t\t\t\t#include <fog_pars_vertex>\n\t\t\t\t#include <shadowmap_pars_vertex>\n\t\t\t\t#include <logdepthbuf_pars_vertex>\n\n\t\t\t\tvoid main() {\n\t\t\t\t\tmirrorCoord = modelMatrix * vec4( position, 1.0 );\n\t\t\t\t\tworldPosition = mirrorCoord.xyzw;\n\t\t\t\t\tmirrorCoord = textureMatrix * mirrorCoord;\n\t\t\t\t\tvec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t\tgl_Position = projectionMatrix * mvPosition;\n\n\t\t\t\t#include <beginnormal_vertex>\n\t\t\t\t#include <defaultnormal_vertex>\n\t\t\t\t#include <logdepthbuf_vertex>\n\t\t\t\t#include <fog_vertex>\n\t\t\t\t#include <shadowmap_vertex>\n\t\t\t}",fragmentShader:"\n\t\t\t\tuniform sampler2D mirrorSampler;\n\t\t\t\tuniform float alpha;\n\t\t\t\tuniform float time;\n\t\t\t\tuniform float size;\n\t\t\t\tuniform float distortionScale;\n\t\t\t\tuniform sampler2D normalSampler;\n\t\t\t\tuniform vec3 sunColor;\n\t\t\t\tuniform vec3 sunDirection;\n\t\t\t\tuniform vec3 eye;\n\t\t\t\tuniform vec3 waterColor;\n\n\t\t\t\tvarying vec4 mirrorCoord;\n\t\t\t\tvarying vec4 worldPosition;\n\n\t\t\t\tvec4 getNoise( vec2 uv ) {\n\t\t\t\t\tvec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);\n\t\t\t\t\tvec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );\n\t\t\t\t\tvec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );\n\t\t\t\t\tvec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );\n\t\t\t\t\tvec4 noise = texture2D( normalSampler, uv0 ) +\n\t\t\t\t\t\ttexture2D( normalSampler, uv1 ) +\n\t\t\t\t\t\ttexture2D( normalSampler, uv2 ) +\n\t\t\t\t\t\ttexture2D( normalSampler, uv3 );\n\t\t\t\t\treturn noise * 0.5 - 1.0;\n\t\t\t\t}\n\n\t\t\t\tvoid sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {\n\t\t\t\t\tvec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );\n\t\t\t\t\tfloat direction = max( 0.0, dot( eyeDirection, reflection ) );\n\t\t\t\t\tspecularColor += pow( direction, shiny ) * sunColor * spec;\n\t\t\t\t\tdiffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;\n\t\t\t\t}\n\n\t\t\t\t#include <common>\n\t\t\t\t#include <packing>\n\t\t\t\t#include <bsdfs>\n\t\t\t\t#include <fog_pars_fragment>\n\t\t\t\t#include <logdepthbuf_pars_fragment>\n\t\t\t\t#include <lights_pars_begin>\n\t\t\t\t#include <shadowmap_pars_fragment>\n\t\t\t\t#include <shadowmask_pars_fragment>\n\n\t\t\t\tvoid main() {\n\n\t\t\t\t\t#include <logdepthbuf_fragment>\n\t\t\t\t\tvec4 noise = getNoise( worldPosition.xz * size );\n\t\t\t\t\tvec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );\n\n\t\t\t\t\tvec3 diffuseLight = vec3(0.0);\n\t\t\t\t\tvec3 specularLight = vec3(0.0);\n\n\t\t\t\t\tvec3 worldToEye = eye-worldPosition.xyz;\n\t\t\t\t\tvec3 eyeDirection = normalize( worldToEye );\n\t\t\t\t\tsunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );\n\n\t\t\t\t\tfloat distance = length(worldToEye);\n\n\t\t\t\t\tvec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;\n\t\t\t\t\tvec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );\n\n\t\t\t\t\tfloat theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );\n\t\t\t\t\tfloat rf0 = 0.3;\n\t\t\t\t\tfloat reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );\n\t\t\t\t\tvec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;\n\t\t\t\t\tvec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);\n\t\t\t\t\tvec3 outgoingLight = albedo;\n\t\t\t\t\tgl_FragColor = vec4( outgoingLight, alpha );\n\n\t\t\t\t\t#include <tonemapping_fragment>\n\t\t\t\t\t#include <colorspace_fragment>\n\t\t\t\t\t#include <fog_fragment>\t\n\t\t\t\t}"},j=new o.jyz({fragmentShader:A.fragmentShader,vertexShader:A.vertexShader,uniforms:o.rDY.clone(A.uniforms),lights:!0,side:f,fog:v});j.uniforms.mirrorSampler.value=L.texture,j.uniforms.textureMatrix.value=C,j.uniforms.alpha.value=s,j.uniforms.time.value=c,j.uniforms.normalSampler.value=l,j.uniforms.sunColor.value=m,j.uniforms.waterColor.value=d,j.uniforms.sunDirection.value=u,j.uniforms.distortionScale.value=h,j.uniforms.eye.value=p,n.material=j,n.onBeforeRender=function(t,e,o){if(y.setFromMatrixPosition(n.matrixWorld),x.setFromMatrixPosition(o.matrixWorld),E.extractRotation(n.matrixWorld),b.set(0,0,1),b.applyMatrix4(E),M.subVectors(y,x),M.dot(b)>0)return;M.reflect(b).negate(),M.add(y),E.extractRotation(o.matrixWorld),w.set(0,0,-1),w.applyMatrix4(E),w.add(x),S.subVectors(y,w),S.reflect(b).negate(),S.add(y),O.position.copy(M),O.up.set(0,1,0),O.up.applyMatrix4(E),O.up.reflect(b),O.lookAt(S),O.far=o.far,O.updateMatrixWorld(),O.projectionMatrix.copy(o.projectionMatrix),C.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),C.multiply(O.projectionMatrix),C.multiply(O.matrixWorldInverse),g.setFromNormalAndCoplanarPoint(b,y),g.applyMatrix4(O.matrixWorldInverse),P.set(g.normal.x,g.normal.y,g.normal.z,g.constant);const a=O.projectionMatrix;T.x=(Math.sign(P.x)+a.elements[8])/a.elements[0],T.y=(Math.sign(P.y)+a.elements[9])/a.elements[5],T.z=-1,T.w=(1+a.elements[10])/a.elements[14],P.multiplyScalar(2/P.dot(T)),a.elements[2]=P.x,a.elements[6]=P.y,a.elements[10]=P.z+1-r,a.elements[14]=P.w,p.setFromMatrixPosition(o.matrixWorld);const i=t.getRenderTarget(),s=t.xr.enabled,c=t.shadowMap.autoUpdate;n.visible=!1,t.xr.enabled=!1,t.shadowMap.autoUpdate=!1,t.setRenderTarget(L),t.state.buffers.depth.setMask(!0),!1===t.autoClear&&t.clear(),t.render(e,O),n.visible=!0,t.xr.enabled=s,t.shadowMap.autoUpdate=c,t.setRenderTarget(i);const l=o.viewport;void 0!==l&&t.state.viewport(l)}}}}}]);
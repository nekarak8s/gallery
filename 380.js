"use strict";(self.webpackChunkgallery=self.webpackChunkgallery||[]).push([[380],{3899:(e,t,s)=>{s.r(t),s.d(t,{default:()=>we});var i=s(1807),a=s(7355),n=s(3823);const o=()=>{const e=(0,i.s0)();return(0,n.jsxs)("nav",{className:"gallery-navbar",children:[(0,n.jsx)("button",{"data-cursor-scale":a.D,onClick:()=>e(-1),children:"Go back"}),(0,n.jsx)("div",{children:"?"})]})};var r=s(7363),h=s(4599),A=s(5301),p=s(4395),d=s(195);class g extends h.cPb{constructor(e){super(e.fov,e.canvas?e.canvas.offsetWidth/e.canvas.offsetHeight:window.innerWidth/window.innerHeight,e.near||.01,e.far||200),this.canvas=e.canvas}setDefaultAspect(){this.aspect=this.canvas?this.canvas.offsetWidth/this.canvas.offsetHeight:window.innerWidth/window.innerHeight}}var c=s(5804),m=s(5980);function l(e,t,s){!function(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object")}(e,t),t.set(e,s)}new p.AO(1,0,0);const w=new p.AO(0,1,0),u=(new p.AO(0,0,1),new p.AO),b=new h.Pa4,x=new p._f,f=new h._fP;var B=new WeakMap,v=new WeakMap,y=new WeakMap,U=new WeakMap,Q=new WeakMap,E=new WeakMap;class F{constructor(e,t){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1.6;(0,A.Z)(this,"enabled",!0),(0,A.Z)(this,"movementSpeed",1),(0,A.Z)(this,"lookSpeed",.3),l(this,B,{writable:!0,value:new p.AO}),l(this,v,{writable:!0,value:new p._f}),l(this,y,{writable:!0,value:0}),l(this,U,{writable:!0,value:0}),l(this,Q,{writable:!0,value:!1}),l(this,E,{writable:!0,value:!1}),this.camera=e,this.world=t,this.height=s;const i=new p.xu(new p.AO(.2,s/2,.2));this.cannonBody=new p.uT({mass:60,position:new p.AO(this.camera.position.x,this.camera.position.y-s/2,this.camera.position.z),shape:i,fixedRotation:!0}),this.cannonBody.quaternion.setFromAxisAngle(new p.AO(0,1,0),this.camera.rotation.y),this.world.addBody(this.cannonBody);const a=this.onKeyDown.bind(this),n=this.onKeyUp.bind(this);window.addEventListener("keydown",a),window.addEventListener("keyup",n),this.dispose=()=>{this.world.removeBody(this.cannonBody),window.removeEventListener("keydown",a),window.removeEventListener("keyup",n)}}onKeyDown(e){switch(e.code){case"ArrowUp":case"KeyW":(0,m.Z)(this,Q,!0);break;case"ArrowLeft":case"KeyA":(0,m.Z)(this,y,-1);break;case"ArrowDown":case"KeyS":(0,m.Z)(this,E,!0);break;case"ArrowRight":case"KeyD":(0,m.Z)(this,U,1)}}onKeyUp(e){switch(e.code){case"ArrowUp":case"KeyW":(0,m.Z)(this,Q,!1);break;case"ArrowLeft":case"KeyA":(0,m.Z)(this,y,0);break;case"ArrowDown":case"KeyS":(0,m.Z)(this,E,!1);break;case"ArrowRight":case"KeyD":(0,m.Z)(this,U,0)}}update(e){if(this.enabled){if(this.cannonBody.velocity.set(0,0,0),(0,c.Z)(this,Q)||(0,c.Z)(this,E)){const e=8e3*this.movementSpeed;this.camera.getWorldDirection(b).normalize().multiplyScalar(e),(0,c.Z)(this,Q)&&this.cannonBody.applyForce(u.set(b.x,b.y,b.z)),(0,c.Z)(this,E)&&this.cannonBody.applyForce(u.set(-b.x,-b.y,-b.z))}if((0,c.Z)(this,y)||(0,c.Z)(this,U)){const t=e*this.lookSpeed,s=this.cannonBody.quaternion;x.set(0,0,0,1),(0,c.Z)(this,y)&&x.setFromAxisAngle(w,t),(0,c.Z)(this,U)&&x.setFromAxisAngle(w,-t),this.cannonBody.quaternion.copy(s.mult(x,s))}this.camera.position.x=this.cannonBody.position.x,this.camera.position.y=this.cannonBody.position.y+this.height,this.camera.position.z=this.cannonBody.position.z,this.camera.quaternion.copy(f.set(this.cannonBody.quaternion.x,this.cannonBody.quaternion.y,this.cannonBody.quaternion.z,this.cannonBody.quaternion.w))}}}class T{constructor(e){(0,A.Z)(this,"name",""),this.name=e.name||"",this.x=e.x||0,this.y=e.y||0,this.z=e.z||0,this.rotationX=e.rotationX||0,this.rotationY=e.rotationY||0,this.rotationZ=e.rotationZ||0,this.width=e.width||0,this.height=e.height||0,this.depth=e.depth||0}setCannonBody(e,t,s){const i=new p.xu(new p.AO(this.width/2,this.height/2,this.depth/2));this.cannonBody=new p.uT({mass:t,position:new p.AO(this.x,this.y,this.z),shape:i,material:s}),this.cannonBody.quaternion.setFromAxisAngle(new p.AO(0,1,0),this.rotationY),e.addBody(this.cannonBody)}}class M extends T{constructor(e){if(super(e),(0,A.Z)(this,"type","ceiling"),(0,A.Z)(this,"textures",{}),this.x+=this.width/2,this.z+=this.depth/2,this.rotationX?this.rotationX+=h.M8C.degToRad(90):this.rotationX=h.M8C.degToRad(90),this.geometry=new h._12(this.width,this.depth),e.texture&&(this.textures.baseTex=e.texture.textureLoader.load(e.texture.baseImg),e.texture.normalImg&&(this.textures.normalTex=e.texture.textureLoader.load(e.texture.normalImg)),e.texture.roughImg&&(this.textures.roughTex=e.texture.textureLoader.load(e.texture.roughImg)),e.texture.ambientImg&&(this.textures.ambientTex=e.texture.textureLoader.load(e.texture.ambientImg)),e.texture.repeatX||e.texture.repeatY))for(const t in this.textures){const s=this.textures[t];s.wrapS=h.rpg,s.wrapT=h.rpg,s.repeat.x=e.texture.repeatX||1,s.repeat.y=e.texture.repeatY||1}this.material=new h.Wid({color:e.color,map:this.textures.baseTex||null,normalMap:this.textures.normalTex||null,roughnessMap:this.textures.roughTex||null,aoMap:this.textures.ambientTex||null,shadowSide:h.ehD}),this.mesh=new h.Kj0(this.geometry,this.material),this.mesh.position.set(this.x,this.y,this.z),this.mesh.rotation.set(this.rotationX,this.rotationY,this.rotationZ),this.mesh.castShadow=!0,this.mesh.receiveShadow=!0,this.mesh.name=this.name||this.type,e.container.add(this.mesh),this.setCannonBody(e.world,0,e.cannonMaterial)}}class j extends T{constructor(e){if(super(e),(0,A.Z)(this,"type","floor"),(0,A.Z)(this,"textures",{}),this.x+=this.width/2,this.z+=this.depth/2,this.rotationX?this.rotationX+=-h.M8C.degToRad(90):this.rotationX=-h.M8C.degToRad(90),this.geometry=new h._12(this.width,this.depth),e.texture&&(this.textures.baseTex=e.texture.textureLoader.load(e.texture.baseImg),e.texture.normalImg&&(this.textures.normalTex=e.texture.textureLoader.load(e.texture.normalImg)),e.texture.roughImg&&(this.textures.roughTex=e.texture.textureLoader.load(e.texture.roughImg)),e.texture.ambientImg&&(this.textures.ambientTex=e.texture.textureLoader.load(e.texture.ambientImg)),e.texture.repeatX||e.texture.repeatY))for(const t in this.textures){const s=this.textures[t];s.wrapS=h.rpg,s.wrapT=h.rpg,s.repeat.x=e.texture.repeatX||1,s.repeat.y=e.texture.repeatY||1}this.material=new h.Wid({color:e.color,roughness:.1,map:this.textures.baseTex||null,normalMap:this.textures.normalTex||null,roughnessMap:this.textures.roughTex||null,aoMap:this.textures.ambientTex||null}),this.mesh=new h.Kj0(this.geometry,this.material),this.mesh.position.set(this.x,this.y,this.z),this.mesh.rotation.set(this.rotationX,this.rotationY,this.rotationZ),this.mesh.receiveShadow=!0,this.mesh.name=this.name||this.type,e.container.add(this.mesh),this.setCannonBody(e.world,0,e.cannonMaterial)}}class I extends T{constructor(e){super(e),(0,A.Z)(this,"type","frame"),this.geometry=new h.DvJ(this.width,this.height,this.depth);const t=e.textureLoader.load(e.baseImg);this.material=new h.Wid({map:t,roughness:.2}),this.mesh=new h.Kj0(this.geometry,this.material),this.mesh.position.set(this.x,this.y,this.z),this.mesh.rotation.set(this.rotationX,this.rotationY,this.rotationZ),this.mesh.receiveShadow=!0,this.mesh.name=this.name||this.type,e.container.add(this.mesh)}}class D extends T{constructor(e){super(e),(0,A.Z)(this,"type","panellight"),this.y-=.5*this.height,this.geometry=new h.DvJ(this.width,this.height,this.depth),this.material=new h.vBJ({color:e.color}),this.mesh=new h.Kj0(this.geometry,this.material),this.mesh.position.set(this.x,this.y,this.z),this.mesh.rotation.set(this.rotationX,this.rotationY,this.rotationZ),this.mesh.name=this.name||this.type,this.light=new h.T_f(e.color,e.intensity,this.width,this.depth),this.light.lookAt(0,-1,0),this.mesh.add(this.light),e.container.add(this.mesh)}}class W extends T{constructor(e){super(e),(0,A.Z)(this,"type","simplepointlight"),this.y-=this.height/2,this.geometry=new h.fHI(this.width/2,this.width/2,this.height),this.material=new h.vBJ({color:e.color}),this.mesh=new h.Kj0(this.geometry,this.material),this.mesh.position.set(this.x,this.y,this.z),this.mesh.rotation.set(this.rotationX,this.rotationY,this.rotationZ),this.mesh.name=this.name||this.type,this.light=new h.cek(e.color,e.intensity,e.distance,e.decay),this.mesh.add(this.light),e.container.add(this.mesh)}}const z=s.p+"images/spotlightc9bef5a21c1a33407d1c.glb";class Z extends T{constructor(e){super(e),(0,A.Z)(this,"type","spotlight"),this.rotationY+=h.M8C.degToRad(90),e.gltfLoader.load(z,(t=>{this.glb=t.scene;const s=(new h.ZzF).setFromObject(t.scene).getSize(new h.Pa4);this.width=s.x,this.height=s.y,this.depth=s.z,this.x-=this.height/2,this.light=new h.PMe(e.color,e.intensity,e.distance,e.angle,e.penumbra,e.decay),this.light.position.x=this.width/2,this.light.position.y=-this.height/2,this.light.target=e.targetMesh,this.glb.add(this.light),this.glb.position.set(this.x,this.y,this.z),this.glb.rotation.set(this.rotationX,this.rotationY,this.rotationZ),this.glb.name=this.name||this.type,e.container.add(this.glb)}))}}class S extends T{constructor(e){if(super(e),(0,A.Z)(this,"type","wall"),(0,A.Z)(this,"textures",{}),this.x+=this.width*Math.cos(this.rotationY)/2,this.y+=this.height/2,this.z+=this.width*Math.sin(this.rotationY)/2,this.geometry=new h.DvJ(this.width,this.height,this.depth),e.texture&&(this.textures.baseTex=e.texture.textureLoader.load(e.texture.baseImg),e.texture.normalImg&&(this.textures.normalTex=e.texture.textureLoader.load(e.texture.normalImg)),e.texture.roughImg&&(this.textures.roughTex=e.texture.textureLoader.load(e.texture.roughImg)),e.texture.ambientImg&&(this.textures.ambientTex=e.texture.textureLoader.load(e.texture.ambientImg)),e.texture.repeatX||e.texture.repeatY))for(const t in this.textures){const s=this.textures[t];s.wrapS=h.rpg,s.wrapT=h.rpg,s.repeat.x=e.texture.repeatX||1,s.repeat.y=e.texture.repeatY||1}this.material=new h.Wid({color:e.color,transparent:e.transparent||!1,opacity:e.opacity,roughness:1,metalness:0,map:this.textures.baseTex||null,normalMap:this.textures.normalTex||null,roughnessMap:this.textures.roughTex||null,aoMap:this.textures.ambientTex||null}),this.mesh=new h.Kj0(this.geometry,this.material),this.mesh.position.set(this.x,this.y,this.z),this.mesh.rotation.set(this.rotationX,this.rotationY,this.rotationZ),this.mesh.castShadow=!e.transparent,this.mesh.receiveShadow=!e.transparent,this.mesh.name=this.name,e.container.add(this.mesh),this.setCannonBody(e.world,0,e.cannonMaterial)}}class R extends h.CP7{constructor(e){super(e),(0,A.Z)(this,"setDefaultSize",(()=>{this.setSize(this.domElement.offsetWidth,this.domElement.offsetHeight)})),this.setPixelRatio(window.devicePixelRatio>1?2:1),this.setSize(this.domElement.offsetWidth,this.domElement.offsetHeight),this.shadowMap.enabled=!0,this.shadowMap.type=h.ntZ}}const _={srcSet:s.p+"responsive-images/nx-43e918c16cf8d470-320.png 320w,"+s.p+"responsive-images/nx-9446f5bd9f92febc-640.png 640w,"+s.p+"responsive-images/nx-51a4b9e5a15f420f-960.png 960w,"+s.p+"responsive-images/nx-63f5b62a3f3cb080-1024.png 1024w",images:[{path:s.p+"responsive-images/nx-43e918c16cf8d470-320.png",width:320,height:320},{path:s.p+"responsive-images/nx-9446f5bd9f92febc-640.png",width:640,height:640},{path:s.p+"responsive-images/nx-51a4b9e5a15f420f-960.png",width:960,height:960},{path:s.p+"responsive-images/nx-63f5b62a3f3cb080-1024.png",width:1024,height:1024}],src:s.p+"responsive-images/nx-63f5b62a3f3cb080-1024.png",toString:function(){return s.p+"responsive-images/nx-63f5b62a3f3cb080-1024.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAA/1BMVEWAg5FQZpNNYo85UIM5R2s2S36FiJdZXnQ5RmUrNlc+SmpVYH2GiJRWbJaOkJ2Cj6ednadmdZdCS2UwO1xJV3iKkJ5TaJR3hqOUmac/VYdTWnBcYnZTXnpPV3BdZHqJi5hofKGIk6hKXINHXo1zgJ+wsr1MU2pGUGxGU3FCTm9aZ4MyP2N2eottc4dTZIaQlKJYcJp+jaiMjZhzg6NYa41Sapdcc51AWYyMk6d+iqRvfJiQl6qfpLReb5VOWXU3QV9iaHxvd40/T3V5gJSSlqJqgKRjd55JZJShoq9ncIhiaoByf5Zuhaanpq2pqrU9RV5PXHxocop/iZuVn7WKkqLLleHlAAAACXBIWXMAAAsTAAALEwEAmpwYAAABVUlEQVR4nE3J1ZqCUBRA4Y0e4UijIKB02AF2gN019f7vMp/OzazLf0Eul8t5c2GhheEikXyixI0P8MJs1htKgZAGaYYocT8hZN/puiT5mUzmhW4Cuq5n9XSWJM/0bQSnxlCaTCb+VDs/wzDwCYJzgkEMM+408TlJmgfujCuNjqo6UEELouPxdBqPCPUccFEUjZ0D9KauKAqqOHVmZ2HsOIf7PQalJ/Z48SGKj4XrCto0FoQF2CRJ2naf53leURR+v9f2GrxjWZJ8XdLuK7zSewkA22fZPuxum91ufrt9Q3uzabc7l3aneYEvr9vtDocSdBiZYWTZYoxrh9luZc/rDsFoIETXl5S1vlp1hLbyJ9MEutVq4Vq5sl5bJo0QashGE1rFYnFVMKmKRZkNjBFdN5qQz+eLq0K1TFUos0ZjjBpL5j+WqwWMMV033vjxh5RZK2BM15a/VKgv5JJ/sLMAAAAASUVORK5CYII=",width:1024,height:1024},C={srcSet:s.p+"responsive-images/ny-881fdf54cdf09324-320.png 320w,"+s.p+"responsive-images/ny-bb63b47858447ab1-640.png 640w,"+s.p+"responsive-images/ny-c01077fb2f78a75c-960.png 960w,"+s.p+"responsive-images/ny-cbef64bf97114415-1024.png 1024w",images:[{path:s.p+"responsive-images/ny-881fdf54cdf09324-320.png",width:320,height:320},{path:s.p+"responsive-images/ny-bb63b47858447ab1-640.png",width:640,height:640},{path:s.p+"responsive-images/ny-c01077fb2f78a75c-960.png",width:960,height:960},{path:s.p+"responsive-images/ny-cbef64bf97114415-1024.png",width:1024,height:1024}],src:s.p+"responsive-images/ny-cbef64bf97114415-1024.png",toString:function(){return s.p+"responsive-images/ny-cbef64bf97114415-1024.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAmVBMVEVSWGw+RVxHTWIsNVE8Q1ozO1VVW25DSV9YXnFOVGc5QFgwOFJMVGw2PVdKUGRcYnU+SWZgZ3tDT2xGT2hHVHFKWHVsc4ZMW3pyeY28vshQWHBkbIBve5WorLmaoLC0t8JCS2VaYnlUXXVkcIl+hZaMkaKCi6GVmqt4gJRPX4FXZ4Zico+jp7aMlatpb4BaZX6CiZt4hZ+vs79xNgzyAAAACXBIWXMAAAsTAAALEwEAmpwYAAABEElEQVR4nE3O246DIBCA4bEFFVSqgCfq+dyurbbv/3Cb0Wyy/80k30wIEMdpmqaPx/On+Lyqb57ndQlSax3H6Ylrnef5d4VQSq1PnOayxsMKwlBKqeP02R9Yf8vqBSGqjrutL/Z5Lcu1ek0QNo2S2nRbnw3jXFXzOH1AKaV833TtPVn2cRynfSnA+L7vG9O1UZItwzAMS5GBa9sAYLu36P5OsqMeXNe1Ed3bLXq/EwzxPD05umOAd4wxOBfo0QZIQgjBMMDztgUmxOUvwfDxroOL8y/BAIwxYBFCrCNCLEcw/DYEQcA5IYRwzonlXIRSCiilFJ0HlAacOI7TNHC9ep6HG4oz4MSyQrhiHnbMg38BEfIcfGbXQYMAAAAASUVORK5CYII=",width:1024,height:1024},H={srcSet:s.p+"responsive-images/nz-620af6dbf8199423-320.png 320w,"+s.p+"responsive-images/nz-167c532bc40d0898-640.png 640w,"+s.p+"responsive-images/nz-7eeb397af90ad63e-960.png 960w,"+s.p+"responsive-images/nz-e86097d9259b4137-1024.png 1024w",images:[{path:s.p+"responsive-images/nz-620af6dbf8199423-320.png",width:320,height:320},{path:s.p+"responsive-images/nz-167c532bc40d0898-640.png",width:640,height:640},{path:s.p+"responsive-images/nz-7eeb397af90ad63e-960.png",width:960,height:960},{path:s.p+"responsive-images/nz-e86097d9259b4137-1024.png",width:1024,height:1024}],src:s.p+"responsive-images/nz-e86097d9259b4137-1024.png",toString:function(){return s.p+"responsive-images/nz-e86097d9259b4137-1024.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAsVBMVEUoMlCGiJYzSHwrNVI4T4MqN1o1S38nMlMvQ3YxRXk9VYkxPmM8UoUnM1ZNWHR8f4+Ji5g1SHgvOlxLY5Jocopwd4pwgJ2AiqA0QWRXYn2EhpF+gY+cn6mEjqNnd5p3hZ86RWZBUHReaYGVmKWBg5KOk6F6iaNUbZg1QF5GXo9UZIWMjpsvOFY9SWtGUG49S29BWoxRXXtabpZpfp9DVXpbc5xfd540RGtga4NTZY9yepCS36ERAAAACXBIWXMAAAsTAAALEwEAmpwYAAABJUlEQVR4nDWJB3KDMBBFFwEiEiBEF6b34oZrnNz/YBkR+83O/v1vwcKYfEmI67quTIKAWhoiH0kIIQhjmKmFkSwuQoQghLGmQe5TS8MIyYqlsSwKbeSvVJO3tm1K/SuU0dWfV/rTFhqldF1nvxjg+Xg+fP9aFHMZFXExjuNYwjBkWX5r22jM4yGP81t0KyHL2jbr+z4uo7iMhjjO+x72+z1XOFc+cM45cK7sdrsuTR1Jmnad0sHmnNQJg0BO+PvrdBAEqRMkYZjcmyZ5Na9lWQJYLsmlPjPGzoydLqyu63sDCauPwjSrUyWEKYQQ32cGyakyPV33Jk//xxRHYNLZhqqqhmHYtm3rnglHIR1sGBLb1qGavIP6lu+HDdPkHQ6qCgCqZNN/yH4eNUrYw/kAAAAASUVORK5CYII=",width:1024,height:1024},Y={srcSet:s.p+"responsive-images/px-9a433e2bae10046c-320.png 320w,"+s.p+"responsive-images/px-4aedb22733aa38dd-640.png 640w,"+s.p+"responsive-images/px-3cfb1b479d7e767e-960.png 960w,"+s.p+"responsive-images/px-582c623f49d7de70-1024.png 1024w",images:[{path:s.p+"responsive-images/px-9a433e2bae10046c-320.png",width:320,height:320},{path:s.p+"responsive-images/px-4aedb22733aa38dd-640.png",width:640,height:640},{path:s.p+"responsive-images/px-3cfb1b479d7e767e-960.png",width:960,height:960},{path:s.p+"responsive-images/px-582c623f49d7de70-1024.png",width:1024,height:1024}],src:s.p+"responsive-images/px-582c623f49d7de70-1024.png",toString:function(){return s.p+"responsive-images/px-582c623f49d7de70-1024.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABQVBMVEWJosSTnrRbb5KBjqqvtL2Ll66/xMxgbIdKYI9IUm6ZorWXsM+RnLKorbiPmq+Lj5xNW3pQX4B9lrqQqcq4v8q7wMhshKussbyjqbd7hJhyhaWRlaFeeKGanqk/SWVDTWlNWHV1j7RTZIZqfJxkdJFWX3dhdplvh62yucNka4B0iKhsdYtmfKG0vc6ftdFygqJDWIl7jauGi5pSaJWHlal4hqS2tr1JVXCAmr9RXHZZZH9UYH1VaY1icIxrgKGDnL6ossO3u8Ryi7BqcYd6kbSfsMedqLvGy9KqtciWq8dngKdZcZt1fpJ2jK6TmKajpa9UbJlcaIR5k7iLmLBYaIiGn7+GocKWprp8iKBuepWksMK8xtLFzdypuc6Gm7mElK6PoruGkKiWnrBxf5pqeJOAip9weZCLpca1wtZja4OnpaxydQ/2AAAACXBIWXMAAAsTAAALEwEAmpwYAAABcUlEQVR4nB3K5VbCABiA4W8sWRIbrAEB6W5RuqVUQsBWRL3/C/CM9+dzXmAYhnFD9T7Qm0WStwWKymazkE4zbjdUXYFOxKNbSFFZeHr6Sbuh6QpEPBN9uVwWKKoAo1QqxcCmet/xTPScepvJlDjYj8TW+LSx1sjkVUXL5fICnvtjANisXb2OZzZjvR8f7yV4TvfHJ9ism64e4pXZXCmp63A4DInUSOy/vbwM6Fyc51Ueh+GQkAhCjO4HW1nmi8Wi8WcAQRBSux2NYpiXWxjGXNMEASRJapct4eSFMdcEQcjnQRSjGIZxMosX59pRUZS8JkCr5eVohH5VG8FjfheaTm+UKWwR5CEXjzcubbad8p1IJEiSBPYBR+ON5KXt+mJFkmQ30e3+AsvjqHo2p9NZr1/FYrEYICyOqsEzOhwOv78WDoeBZnE0EwzZVhb6K3YroBEcLQVDN+TdVb3mr9h9PtOEAc2/P35+nTVcq9h9pmn+Az9/PqXb36LAAAAAAElFTkSuQmCC",width:1024,height:1024},K={srcSet:s.p+"responsive-images/py-f22d663e9d68076d-320.png 320w,"+s.p+"responsive-images/py-7a3f2b125700b943-640.png 640w,"+s.p+"responsive-images/py-9419883ae8b47c29-960.png 960w,"+s.p+"responsive-images/py-6a1c0fd8c6b43d39-1024.png 1024w",images:[{path:s.p+"responsive-images/py-f22d663e9d68076d-320.png",width:320,height:320},{path:s.p+"responsive-images/py-7a3f2b125700b943-640.png",width:640,height:640},{path:s.p+"responsive-images/py-9419883ae8b47c29-960.png",width:960,height:960},{path:s.p+"responsive-images/py-6a1c0fd8c6b43d39-1024.png",width:1024,height:1024}],src:s.p+"responsive-images/py-6a1c0fd8c6b43d39-1024.png",toString:function(){return s.p+"responsive-images/py-6a1c0fd8c6b43d39-1024.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABGlBMVEUvQnVccpqFnsG9v8gxRHczR3hZbpc2SXtUaZOctNJcaYulqLa0t8G4usRedp6PqMhnfqQ8U4WBmr0sP3Nwepd8hJ2Mk6k7TXugpLKboK9heaFshqzg4uhLWoPDxc3S0terrbiTmKpVY4hvirF3kbaZr82iuNStv9fW3OZ7k7euu85QZY++w89AUn7NztShp7iYnKyytcBGWYOPlaeZprxre5yco7VgbpBogac4TYG8ydzJ0d/6+fny8vRLYYy5vstEW4u2u8rGy9bP09t1iquws72lrLyFi6F1gp+Urcynu9d0j7SotMiyt8SMmrGVnbGrsb+Dk62XobVXaY3n6O2BjKfv8PPN1eJ+l7fY2Nt6h6NndJXFyNCRp8Texu1xAAAACXBIWXMAAAsTAAALEwEAmpwYAAABZklEQVR4nCXL1XbCUBRF0RO9UeJGQgyKBQ1a3KHUXf//OzrS7sc51gaKIiEbRZKggQYkulTgzzTUTAsUaBpVaGaIsgRxuqFbJFXQDe5SUQAhhCy9Y/CmBVwY9cxEWUGKyMKow3OiSaHYjpxwoKygZ46aRtjjjNiyYl4UhHsmgb3gxEfb4o5x2hx1hbArtGWwzW894nWu5zjP6cnpdMT1DnjBNPjjKCKC4SI5hbZD9GXwiWF0uE/toP08GDzsbf620QdC9Nvi8CS2nh7FQ3/f9VubPghE92s4eAh+7p4+W0u/tb1Rr4Fo0wmD3R0edzfbW8IPNmqtBq/YgqFz8q72Ua83gmWjgas4rBYMg+XHbkmV6tvNer2s4zgkTBa6xRouse+e53lTSQKGobG87F6r0hVbqc7e5tUyCzSN5fLjYgm/uGAr0/lsXj2zkJns/uN54s1eJmUWsFwuP3aLpezOnifVaaXM/gK9pjMT1+ivhQAAAABJRU5ErkJggg==",width:1024,height:1024},O={srcSet:s.p+"responsive-images/pz-10f488cd9e60ca04-320.png 320w,"+s.p+"responsive-images/pz-56fe2eb414b5f4e6-640.png 640w,"+s.p+"responsive-images/pz-d229405ea56feb25-960.png 960w,"+s.p+"responsive-images/pz-0050c5a4c59e08ac-1024.png 1024w",images:[{path:s.p+"responsive-images/pz-10f488cd9e60ca04-320.png",width:320,height:320},{path:s.p+"responsive-images/pz-56fe2eb414b5f4e6-640.png",width:640,height:640},{path:s.p+"responsive-images/pz-d229405ea56feb25-960.png",width:960,height:960},{path:s.p+"responsive-images/pz-0050c5a4c59e08ac-1024.png",width:1024,height:1024}],src:s.p+"responsive-images/pz-0050c5a4c59e08ac-1024.png",toString:function(){return s.p+"responsive-images/pz-0050c5a4c59e08ac-1024.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABKVBMVEWctNKapbhvgqJleZymrLpdaoWdp7qIl7DDytSOqMmdqL2Urs6SorvCyNCYstHBxcxMXX9QY4Zpc4u8wsp/jai2vsmgq79fc5WOnbWYpryVoLWxt8OkudSQm7CkqLN0iq2bqb+7xtWgttO5vsetsbtTX3xUaIujsMNzjrVoeJZhcI5Ya49zgJmAm79tiLCos8WGmbW+xMycrMKNob2FmrqHk6irvdWgpK6xuciwwNV7kLKessy2w9XG0NxccJKEnsJibYV0fZOts8J5gpi3u8Z4k7h7lrypsMCIo8acoKtrfp6Bl7eYnatuhKetvdC/y9x7jaxYYnxwfJSPlKJ8iaC0vcqLpMR0h6Rog6vN0dymtstkgKmructeeaVaZoGOmKqWrMq5w8+ClLCSOMuGAAAACXBIWXMAAAsTAAALEwEAmpwYAAABbUlEQVR4nC3L51aCABiA4Q9lyVRQWTIE3OTeYpla7pWZo33/N9Gx+vuc9wVi0n0/FbMPN3chmrObnWbCBlC12PtrsZh9vJmGaLATts3RsER56/X0jxwAcLABHXX5Uve6T0M0zQHHbZKw1dGxU6o9XEu/DwD9cxu2K5OhFvX6S+jlyz8n7E3f92FlmmZ3UWfabK9HJpuJZqezBoIgEGZRY6xLr3dZd/wk2U9Cy1ARXKGU6tvb+pslSZJlSZi1Wobhuq7mVHieZVm2wvOwnC1nLcNAXc1xHLFSEUVRhP2+0fhsEISMW/Fh+3A4xGIx8Dzv+XkeODbkclmpVjMlrV2CfF568nLBeVTfdvF4rWZlMhZg+dxolJOk+TFgqpRcVzJxBAbC/cgTCgUpGFwRarnMUH94L2DpdEEKBqKELDMKhQA2EAQsEokUbq+o4nEKR2D3gX2kwuFI+oo6PhlOUBxSu1Qq/Iu5QFRHtfF4iP4Aup07icd++pkAAAAASUVORK5CYII=",width:1024,height:1024},X={srcSet:s.p+"responsive-images/Wood_Herringbone_Tiles_001_ambientOcclusion-ca7697cf6c2737e8-320.jpg 320w,"+s.p+"responsive-images/Wood_Herringbone_Tiles_001_ambientOcclusion-4382bad48ec03d4e-640.jpg 640w,"+s.p+"responsive-images/Wood_Herringbone_Tiles_001_ambientOcclusion-776252c75ce13cd4-960.jpg 960w,"+s.p+"responsive-images/Wood_Herringbone_Tiles_001_ambientOcclusion-f5b6e3dce24dfe0a-1024.jpg 1024w",images:[{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_ambientOcclusion-ca7697cf6c2737e8-320.jpg",width:320,height:320},{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_ambientOcclusion-4382bad48ec03d4e-640.jpg",width:640,height:640},{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_ambientOcclusion-776252c75ce13cd4-960.jpg",width:960,height:960},{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_ambientOcclusion-f5b6e3dce24dfe0a-1024.jpg",width:1024,height:1024}],src:s.p+"responsive-images/Wood_Herringbone_Tiles_001_ambientOcclusion-f5b6e3dce24dfe0a-1024.jpg",toString:function(){return s.p+"responsive-images/Wood_Herringbone_Tiles_001_ambientOcclusion-f5b6e3dce24dfe0a-1024.jpg"},placeholder:"data:image/jpeg;base64,/9j/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAUABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECCf/EABwQAAIBBQEAAAAAAAAAAAAAAAABEQIhMUHRof/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDqSXa6BsCObR4wHroAjcLBZlpQABmp3wAAP//Z",width:1024,height:1024},L={srcSet:s.p+"responsive-images/Wood_Herringbone_Tiles_001_basecolor-4a4765aec08423e8-320.jpg 320w,"+s.p+"responsive-images/Wood_Herringbone_Tiles_001_basecolor-60e3fb00f4b5afa7-640.jpg 640w,"+s.p+"responsive-images/Wood_Herringbone_Tiles_001_basecolor-a5cdd418619024b5-960.jpg 960w,"+s.p+"responsive-images/Wood_Herringbone_Tiles_001_basecolor-8afe057407c5a95f-1024.jpg 1024w",images:[{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_basecolor-4a4765aec08423e8-320.jpg",width:320,height:320},{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_basecolor-60e3fb00f4b5afa7-640.jpg",width:640,height:640},{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_basecolor-a5cdd418619024b5-960.jpg",width:960,height:960},{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_basecolor-8afe057407c5a95f-1024.jpg",width:1024,height:1024}],src:s.p+"responsive-images/Wood_Herringbone_Tiles_001_basecolor-8afe057407c5a95f-1024.jpg",toString:function(){return s.p+"responsive-images/Wood_Herringbone_Tiles_001_basecolor-8afe057407c5a95f-1024.jpg"},placeholder:"data:image/jpeg;base64,/9j/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAUABQDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAECAwj/xAAkEAABAwMDBAMAAAAAAAAAAAABAAIRAxIhMUFhBBMicTKx4f/EABYBAQEBAAAAAAAAAAAAAAAAAAIBBf/EABcRAQEBAQAAAAAAAAAAAAAAAAABYTH/2gAMAwEAAhEDEQA/APDTjTkkHJGgGAq0l9S27AxO0rM30m4wD5EbelYLQ20cmforGxs6y+Q74g8g6orUaJFl4EZDW6FEgUVIaXwJG2xxutOcW9TSYMCRp6/URGcNzc3uG4zPCIisSv/Z",width:1024,height:1024},q={srcSet:s.p+"responsive-images/Wood_Herringbone_Tiles_001_normal-609edab62670687c-320.jpg 320w,"+s.p+"responsive-images/Wood_Herringbone_Tiles_001_normal-3c167e3f8b47c507-640.jpg 640w,"+s.p+"responsive-images/Wood_Herringbone_Tiles_001_normal-7f5bcf96e2a8e3ce-960.jpg 960w,"+s.p+"responsive-images/Wood_Herringbone_Tiles_001_normal-c9f6a6e78edac0a1-1024.jpg 1024w",images:[{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_normal-609edab62670687c-320.jpg",width:320,height:320},{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_normal-3c167e3f8b47c507-640.jpg",width:640,height:640},{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_normal-7f5bcf96e2a8e3ce-960.jpg",width:960,height:960},{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_normal-c9f6a6e78edac0a1-1024.jpg",width:1024,height:1024}],src:s.p+"responsive-images/Wood_Herringbone_Tiles_001_normal-c9f6a6e78edac0a1-1024.jpg",toString:function(){return s.p+"responsive-images/Wood_Herringbone_Tiles_001_normal-c9f6a6e78edac0a1-1024.jpg"},placeholder:"data:image/jpeg;base64,/9j/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAUABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECBv/EAB0QAQEAAQQDAAAAAAAAAAAAAAABAhEhIlESMWH/xAAYAQACAwAAAAAAAAAAAAAAAAABAgAFCP/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIRAxEAPwDqd/YUrVCpNb2LjduwDSRjyvH6XLloAgszuICHj//Z",width:1024,height:1024},V={srcSet:s.p+"responsive-images/Wood_Herringbone_Tiles_001_roughness-d209e050011a77d4-320.jpg 320w,"+s.p+"responsive-images/Wood_Herringbone_Tiles_001_roughness-7e48fda3ed23d740-640.jpg 640w,"+s.p+"responsive-images/Wood_Herringbone_Tiles_001_roughness-2bd06e4689190bc5-960.jpg 960w,"+s.p+"responsive-images/Wood_Herringbone_Tiles_001_roughness-50b24d5b6f249ed8-1024.jpg 1024w",images:[{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_roughness-d209e050011a77d4-320.jpg",width:320,height:320},{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_roughness-7e48fda3ed23d740-640.jpg",width:640,height:640},{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_roughness-2bd06e4689190bc5-960.jpg",width:960,height:960},{path:s.p+"responsive-images/Wood_Herringbone_Tiles_001_roughness-50b24d5b6f249ed8-1024.jpg",width:1024,height:1024}],src:s.p+"responsive-images/Wood_Herringbone_Tiles_001_roughness-50b24d5b6f249ed8-1024.jpg",toString:function(){return s.p+"responsive-images/Wood_Herringbone_Tiles_001_roughness-50b24d5b6f249ed8-1024.jpg"},placeholder:"data:image/jpeg;base64,/9j/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAUABQDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAEH/8QAGxABAQEAAgMAAAAAAAAAAAAAAAExERIhQWH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A0hdM9eD6BKE4AJkAA7WYAD//2Q==",width:1024,height:1024};function k(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,i)}return s}function N(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?k(Object(s),!0).forEach((function(t){(0,A.Z)(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):k(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}const G={depth:.2,height:4.5},J={depth:.1,height:4.5,transparent:!0,opacity:.2},P={y:2.5,width:1.5,height:1.5,depth:.05},$={color:"#FFFFFF",intensity:8,distance:4,angle:Math.PI/8,z:3},ee={color:"#FFFCE5",intensity:.6,y:G.height,width:1,height:.01,depth:1},te={color:"#FFFCE5",intensity:.1,distance:5,y:G.height,width:.07,height:.02},se=[{x:0,z:0,width:20,frames:[{order:5,x:-8,isDownRight:!0}]},{x:3.8,z:13.52,width:6.54,frames:[{order:3,x:0,isDownRight:!0},{order:7,x:0,isDownRight:!1}]},{x:10.34,z:17.43,width:.77},{x:13.53,z:17.43,width:6.47,frames:[{order:8,x:0,isDownRight:!1}]},{x:0,z:20.78,width:6.53},{x:9.57,z:20.78,width:.77},{x:10.34,z:23.88,width:6.56,frames:[{order:9,x:0,isDownRight:!1}]},{x:19.22,z:23.88,width:.77},{x:4.34,z:25.96,width:6,frames:[{order:2,x:0,isDownRight:!1}]},{x:15.12,z:26.98,width:4.88},{x:0,z:30,width:20}],ie=[{x:0,z:0,width:30,frames:[{order:1,x:-10,isDownRight:!0},{order:4,x:-2,isDownRight:!0}]},{x:3.9,z:2.69,width:10.83,frames:[{order:6,x:1,isDownRight:!0}]},{x:10.34,z:13.42,width:16.62,frames:[{order:10,x:-6,isDownRight:!0}]},{x:20,z:0,width:1},{x:20,z:16.63,width:1.6},{x:20,z:23,width:7}],ae=[{x:20,z:.95,width:15.68},{x:20,z:18.23,width:4.77}],ne=[{x:5,z:16.7},{x:5,z:23.1},{x:8.5,z:3.5},{x:8.5,z:9.2},{x:15.6,z:3.5},{x:15.6,z:9.2},{x:15.6,z:14.6},{x:15.6,z:20.4}],oe=[{x:1.8,z:3.4},{x:1.8,z:7.2},{x:1.8,z:11},{x:1.8,z:25.9},{x:7.2,z:27.9},{x:13.2,z:25.5},{x:13.2,z:28.5}],re=e=>{let{canvas:t,loadingManager:s,gallery:i,frameList:a}=e;const n=new h.dpR(s),o=new h.cBK(s),r=new d.E(s),A=new R({canvas:t,antialias:!0}),c=new h.xsS;c.background=o.load([Y,_,K,C,O,H]);const m=new p.q3;m.broadphase=new p.BQ(m);const l=new g({canvas:t});l.position.set(3,1.6,29),c.add(l);const w=new F(l,m,1.6),u=[],b=new h.Mig("white",.05);c.add(b),u.push(b);const x=new h.Ox3("white",1);x.position.set(30,30,0),x.shadow.camera.left=-30,x.shadow.camera.right=0,x.shadow.camera.top=5,x.shadow.camera.bottom=-20,x.castShadow=!0,c.add(x),u.push(x);const f=new h.T_f("white",1,ae[0].width,G.height);f.position.set(ae[0].x,G.height/2,ae[0].z+ae[0].width/2),f.lookAt(0,G.height/2,ae[0].z+ae[0].width/2),c.add(f),u.push(f);const B=new h.T_f("white",1,ae[1].width,G.height);B.position.set(ae[1].x,G.height/2,ae[1].z+ae[1].width/2),B.lookAt(0,G.height/2,ae[1].z+ae[1].width/2),c.add(B),u.push(B);const v=[],y=new j({container:c,world:m,name:"floor",width:20,depth:30,texture:{textureLoader:n,baseImg:L,normalImg:q,ambientImg:X,roughImg:V,repeatX:4,repeatY:6}});v.push(y);const U=new M({container:c,world:m,name:"ceiling",width:20,depth:30,y:G.height});v.push(U),se.forEach(((e,t)=>{const s=new S(N(N({},G),{},{container:c,world:m,name:"horizontal-wall-".concat(t+1),x:e.x,z:e.z,width:e.width}));v.push(s),e.frames&&e.frames.forEach((e=>{const t=new I(N(N({},P),{},{container:s.mesh,name:"frame_".concat(e.order),baseImg:a[e.order-1].framePictureUrl,textureLoader:n,x:e.x,y:P.y-G.height/2,z:e.isDownRight?G.depth/2:-G.depth/2,rotationY:e.isDownRight?0:h.M8C.degToRad(180)}));v.push(t);const i=new Z(N(N({},$),{},{container:t.mesh,name:"spotlight",gltfLoader:r,targetMesh:t.mesh,y:G.height-P.y}));v.push(i)}))})),ie.forEach(((e,t)=>{const s=new S(N(N({},G),{},{container:c,name:"vertical-wall-".concat(t+1),world:m,x:e.x,z:e.z,width:e.width,rotationY:h.M8C.degToRad(90)}));v.push(s),e.frames&&e.frames.forEach((e=>{const t=new I(N(N({},P),{},{container:s.mesh,name:"frame_".concat(e.order),baseImg:a[e.order-1].framePictureUrl,textureLoader:n,x:e.x,y:P.y-G.height/2,z:e.isDownRight?G.depth/2:-G.depth/2,rotationY:e.isDownRight?0:h.M8C.degToRad(180)}));v.push(t);const i=new Z(N(N({},$),{},{container:t.mesh,name:"spotlight",gltfLoader:r,targetMesh:t.mesh,y:G.height-P.y}));v.push(i)}))})),ae.forEach(((e,t)=>{const s=new S(N(N({},J),{},{container:c,name:"vertical-glass-wall-".concat(t+1),world:m,x:e.x,z:e.z,width:e.width,rotationY:h.M8C.degToRad(90)}));v.push(s)})),ne.forEach(((e,t)=>{const s=new D(N(N({},ee),{},{container:c,name:"panellight-".concat(t+1),x:e.x,z:e.z}));v.push(s)})),oe.forEach(((e,t)=>{const s=new W(N(N({},te),{},{container:c,name:"pointlight-".concat(t+1),x:e.x,z:e.z}));v.push(s)}));const Q=new h.SUY,E=function(){const e=Q.getDelta();let t=1/60;e<.01&&(t=1/120),m.step(t,e,3),w.update(e),A.render(c,l),A.setAnimationLoop(E)};E();const T=function(){l.setDefaultAspect(),l.updateProjectionMatrix(),A.setDefaultSize(),A.render(c,l)};window.addEventListener("resize",T);return{dispose:function(){u.forEach((e=>{c.remove(e),e.dispose()})),v.forEach((e=>{if(e.mesh&&c.remove(e.mesh),e.glb&&c.remove(e.glb),e.light&&c.remove(e.light),e.light&&e.light.dispose(),e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose(),e.textures)for(const t in e.textures){e.textures[t].dispose()}e.cannonBody&&m.removeBody(e.cannonBody)})),c.remove(l),A.dispose(),w.dispose(),window.removeEventListener("resize",T)}}},he={srcSet:s.p+"responsive-images/2d-99d385f359af40ec-320.png 320w,"+s.p+"responsive-images/2d-51aa8be7e286b9e7-380.png 380w",images:[{path:s.p+"responsive-images/2d-99d385f359af40ec-320.png",width:320,height:397},{path:s.p+"responsive-images/2d-51aa8be7e286b9e7-380.png",width:380,height:472}],src:s.p+"responsive-images/2d-51aa8be7e286b9e7-380.png",toString:function(){return s.p+"responsive-images/2d-51aa8be7e286b9e7-380.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAZCAMAAAAGyf7hAAAAyVBMVEXd3dxjY2RgYWLc3N/b29vg4ODh4eLd3d1nZ2doaGhkZmrk5OPU1NVgX2BqamlmZmazs7Lc3uOfn59oaGrh4uXe3t6QkJHj3tLAwMCHh4doZ2br05fl5ebp1qWGdk51dXXk5urpzoixoHTszXzDqGVtaFzm28He3NfT0s/DxMaRfETo27eFeFji2sZ8cVN3blSJi5HHx8fk1rOws7rWunO6nVLeuVvMu47JqVPayqGkhztnYlTMqEump6lhXlWjkF/Lpkioij3X2d79F2ZCAAAACXBIWXMAAAsTAAALEwEAmpwYAAABN0lEQVR4nG3Q146DQAwFUDPjaZQhJLQQCCG997K9/P9PrQgQ5WHvk3UkW9YFKZXTtmg0GoFoAjVuitGMgoBnRHqc3g0aJO0UwfNAIJ1RvGNibscrCgAC/GmxGkCFy5eeV47W5/fPZW8HUK5PhhEFITDdf/UnZM7u6LTT8hKmITFd/UALhQCaXXYq6dgcn7H30Tdd/RrR5iUBSKOhocx10SvXzd14SiEIYBA62lwXmQCtO8txRtG2bQgd7XbmjAIh5H0Y8UOe57l2pattBhCGYffks4U0XMOVsnrJsiyLIT9oZSZmg4iIAHyRGNvfvuEaqsSq1sCO49v1HMdxjEHdqgDBORwjzjj3KNbIOWPM54zxWbbxq6aDuFXndLueWxXyrmNUIZO3PmmQaFVFKqkeqGSTRP6DUv4BgZ0ckUcj224AAAAASUVORK5CYII=",width:380,height:472},Ae={srcSet:s.p+"responsive-images/3d-8e07d3dd2b0a80c5-124.png 124w",images:[{path:s.p+"responsive-images/3d-8e07d3dd2b0a80c5-124.png",width:124,height:124}],src:s.p+"responsive-images/3d-8e07d3dd2b0a80c5-124.png",toString:function(){return s.p+"responsive-images/3d-8e07d3dd2b0a80c5-124.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABCFBMVEVMaXHNzc3AwMCfn5+pqanc3NyysrLX19fY2NjW1tbFxcWdnZ2np6fKysrU1NSfn5/S0tLOzs7j4+PQ0NCWlpbp6enOzs7l5eWXl5empqbDw8OwsLCtra3Pz8+urq7Hx8esrKzr6+u0tLTNzc3Kysrr6+vY2NiSkpLl5eXw8PC/v7+ysrKurq7U1NTS0tKsrKyxsbHT09PMzMzV1dXS0tKsrKyvr6/o6OjPz8+YmJiKioq9vb3U1NSfn5+YmJj29vaPj4/IyMiQkJDl5eXDw8P////q6uqOjo65ubnKysrU1NTj4+POzs61tbXR0dHKysr7+/v39/ff39/BwcG5ubm4ubmjo6OsrKwnYYVlAAAAVnRSTlMA+4kS/v7+AQIF/v38EYRf/CYV+/3SyLiXmoJoijX7j+RF9lRC/fr7i/thKHtmyrFF5Zek78uWT6g0XPu26u0+ie5KbsAi5RkL1P///////////////mpBzjgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAETSURBVHicZZHXbsMwFEPpWLIk29l779W9d5vuIe+kSf//TwobbtOgfDwgCF5eIBbHPwmBXKq/gbiA2D205kdga8gw2LNo3i0J/kMZkseUZjzdKwnwOJsjvVCktD23zbMCIjILpAuGY8uHfvZGXmSjXC6QJsaY2M+o6go9SSWjxPPc1a1p0hIqmpLPzGsAmkW/2FXvyccAVTlyFTsBICFpEJRf3t6BiqHZGRrChtbSLX86yQHV1di4dkO4s9BMLT8MXp/weLcqmLIdNqp3li2yHE2D4kytFJbeVnSQ2uh9ErKYB/4El2fNqChj2N53HPNLGZZDz3rLg1OH9Kwy2O8koVnUO7qV+rsdwBnUWneTxf+I2TeZayAPaT/EPwAAAABJRU5ErkJggg==",width:124,height:124},pe={galleryId:1,name:"갤러리1",content:"대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.",createdDate:"2023-08-03 23:59:59",modifiedDate:"2023-08-04 00:59:59",place:{placeId:1,name:"Gallery A",maximumFrameNumber:10,threeDimensionImageUrl:Ae,twoDimensionImageUrl:he}},de=[{frameId:1,order:1,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:2,order:2,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:3,order:3,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:4,order:4,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:5,order:5,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:6,order:6,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:7,order:7,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:8,order:8,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:9,order:9,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:10,order:10,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}}];var ge=s(2914),ce=s(2233);const me={1:re},le=()=>{const e=(0,r.useRef)(null),t=pe,s=de,[i,a]=(0,r.useState)(0),[o,A]=(0,r.useState)(0);return(0,r.useEffect)((()=>{if(!t||!s)return;const i=e.current,n=new h.lLk;n.onStart=function(){a((e=>e+1))},n.onLoad=function(){A((e=>e+1))};const{dispose:o}=me[t.place.placeId]({loadingManager:n,canvas:i,gallery:t,frameList:s});return()=>{a(0),A(0),o()}}),[t,s]),(0,n.jsxs)("div",{className:"gallery-canvas",children:[(0,n.jsx)("canvas",{ref:e}),(0,n.jsx)(ge.Z,{className:"gallery-canvas__loading",isShow:i!==o,duration:1e3,timingFunction:"ease-in-out",children:(0,n.jsx)(ce.Z,{})})]})},we=()=>(0,n.jsxs)("div",{className:"gallery",children:[(0,n.jsx)("div",{className:"gallery__navbar",children:(0,n.jsx)(o,{})}),(0,n.jsx)("div",{className:"gallery__canvas",children:(0,n.jsx)(le,{})})]})}}]);
"use strict";(self.webpackChunkgallery=self.webpackChunkgallery||[]).push([[378],{2550:(e,s,t)=>{t.r(s),t.d(s,{default:()=>ie});var i=t(1807),a=t(7355),n=t(3823);const o=()=>{const e=(0,i.s0)();return(0,n.jsxs)("nav",{className:"gallery-navbar",children:[(0,n.jsx)("button",{"data-cursor-scale":a.D,onClick:()=>e(-1),children:"Go back"}),(0,n.jsx)("div",{children:"?"})]})};var r=t(7363),p=t(4599),h=t(4395),c=t(195),d=t(7916);class m extends p.cPb{constructor(e){super(e.fov||45,e.canvas?e.canvas.offsetWidth/e.canvas.offsetHeight:window.innerWidth/window.innerHeight,e.near||.01,e.far||200),this.canvas=e.canvas}setDefaultAspect(){this.aspect=this.canvas?this.canvas.offsetWidth/this.canvas.offsetHeight:window.innerWidth/window.innerHeight}}var A=t(5301),g=t(5804),l=t(5980);function w(e,s,t){!function(e,s){if(s.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object")}(e,s),s.set(e,t)}new h.AO(1,0,0);const u=new h.AO(0,1,0),y=(new h.AO(0,0,1),new h.AO),f=new p.Pa4(0,-1,0),b=new p.Pa4,v=new p.FM8(0,0),x=new h._f,B=new p._fP;var Z=new WeakMap,z=new WeakMap,E=new WeakMap,U=new WeakMap,S=new WeakMap;class q{constructor(e,s,t){let i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1.6;(0,A.Z)(this,"floors",[]),(0,A.Z)(this,"rayItems",[]),(0,A.Z)(this,"enabled",!0),(0,A.Z)(this,"movementSpeed",1.8),(0,A.Z)(this,"lookSpeed",.5),w(this,Z,{writable:!0,value:!1}),w(this,z,{writable:!0,value:0}),w(this,E,{writable:!0,value:0}),w(this,U,{writable:!0,value:!1}),w(this,S,{writable:!0,value:!1}),this.canvas=e,this.camera=s,this.world=t,this.height=i,this.raycaster=new p.iMs;const a=new h.xu(new h.AO(.2,i/2,.2));this.cannonBody=new h.uT({mass:40,position:new h.AO(this.camera.position.x,this.camera.position.y-i/2,this.camera.position.z),shape:a,fixedRotation:!0});const n=new h._f,o=new h._f,r=new h._f;n.setFromAxisAngle(new h.AO(1,0,0),this.camera.rotation.x),o.setFromAxisAngle(new h.AO(0,1,0),this.camera.rotation.y),r.setFromAxisAngle(new h.AO(0,0,1),this.camera.rotation.z),this.cannonBody.quaternion.copy(n.mult(o).mult(r)),this.world.addBody(this.cannonBody);const c=this.onKeyDown.bind(this),d=this.onKeyUp.bind(this);window.addEventListener("keydown",c),window.addEventListener("keyup",d);const m=document.createElement("div");m.id="target",this.canvas.parentNode.insertBefore(m,e.nextSibling),this.dispose=()=>{this.world.removeBody(this.cannonBody),window.removeEventListener("keydown",c),window.removeEventListener("keyup",d);const e=document.getElementById("target");e&&e.remove()}}onKeyDown(e){switch(e.preventDefault(),e.code){case"ArrowUp":case"KeyW":(0,l.Z)(this,U,!0);break;case"ArrowLeft":case"KeyA":(0,l.Z)(this,z,-1);break;case"ArrowDown":case"KeyS":(0,l.Z)(this,S,!0);break;case"ArrowRight":case"KeyD":(0,l.Z)(this,E,1);break;case"Space":if(this.raycast){this.raycaster.setFromCamera(v,this.camera);const e=this.raycaster.intersectObjects(this.rayItems);for(const s of e){this.raycast(s);break}}}}onKeyUp(e){switch(e.code){case"ArrowUp":case"KeyW":(0,l.Z)(this,U,!1);break;case"ArrowLeft":case"KeyA":(0,l.Z)(this,z,0);break;case"ArrowDown":case"KeyS":(0,l.Z)(this,S,!1);break;case"ArrowRight":case"KeyD":(0,l.Z)(this,E,0)}}update(e){if(!this.enabled)return;(0,l.Z)(this,Z,!1),this.raycaster.set(this.camera.position,f);const s=this.raycaster.intersectObjects(this.floors);for(const e of s){this.cannonBody.position.y+=this.height-e.distance,(0,l.Z)(this,Z,!0);break}if(this.cannonBody.velocity.set(0,0,0),(0,g.Z)(this,U)||(0,g.Z)(this,S)){const e=1e4*this.movementSpeed;this.camera.getWorldDirection(b).normalize().multiplyScalar(e),(0,g.Z)(this,U)&&this.cannonBody.applyForce(y.set(b.x,b.y,b.z)),(0,g.Z)(this,S)&&this.cannonBody.applyForce(y.set(-b.x,-b.y,-b.z))}if((0,g.Z)(this,z)||(0,g.Z)(this,E)){const s=e*this.lookSpeed,t=this.cannonBody.quaternion;x.set(0,0,0,1),(0,g.Z)(this,z)&&x.setFromAxisAngle(u,s),(0,g.Z)(this,E)&&x.setFromAxisAngle(u,-s),this.cannonBody.quaternion.copy(t.mult(x,t))}this.camera.position.x=this.cannonBody.position.x,this.camera.position.y=this.cannonBody.position.y+this.height,this.camera.position.z=this.cannonBody.position.z,this.camera.quaternion.copy(B.set(this.cannonBody.quaternion.x,this.cannonBody.quaternion.y,this.cannonBody.quaternion.z,this.cannonBody.quaternion.w))}}class K{constructor(e){(0,A.Z)(this,"name",""),this.name=e.name||"",this.x=e.x||0,this.y=e.y||0,this.z=e.z||0,this.rotationX=e.rotationX||0,this.rotationY=e.rotationY||0,this.rotationZ=e.rotationZ||0,this.width=e.width||0,this.height=e.height||0,this.depth=e.depth||0}setBoxCannonBody(e){let s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,t=arguments.length>2?arguments[2]:void 0,i=arguments.length>3?arguments[3]:void 0,a=arguments.length>4?arguments[4]:void 0,n=arguments.length>5?arguments[5]:void 0;const o=new h.xu(new h.AO(i?i/2:this.width/2,a?a/2:this.height/2,n?n/2:this.depth/2));this.cannonBody=new h.uT({mass:s,position:new h.AO(this.x,this.y,this.z),shape:o,material:t});const r=new h._f,p=new h._f,c=new h._f;r.setFromAxisAngle(new h.AO(1,0,0),this.rotationX),p.setFromAxisAngle(new h.AO(0,1,0),this.rotationY),c.setFromAxisAngle(new h.AO(0,0,1),this.rotationZ),this.cannonBody.quaternion.copy(r.mult(p).mult(c)),e.addBody(this.cannonBody)}setCylinderCannonBody(e){let s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,t=arguments.length>2?arguments[2]:void 0,i=arguments.length>3?arguments[3]:void 0,a=arguments.length>4?arguments[4]:void 0,n=arguments.length>5?arguments[5]:void 0;const o=new h.Ab(i?i/2:this.width/2,i?i/2:this.width/2,a?a/2:this.height/2,n||12);this.cannonBody=new h.uT({mass:s,position:new h.AO(this.x,this.y,this.z),shape:o,material:t});const r=new h._f,p=new h._f,c=new h._f;r.setFromAxisAngle(new h.AO(1,0,0),this.rotationX),p.setFromAxisAngle(new h.AO(0,1,0),this.rotationY),c.setFromAxisAngle(new h.AO(0,0,1),this.rotationZ),this.cannonBody.quaternion.copy(r.mult(p).mult(c)),e.addBody(this.cannonBody)}}class I extends K{constructor(e){super(e),(0,A.Z)(this,"type","frame"),this.geometry=new p.DvJ(this.width,this.height,this.depth);const s=e.textureLoader.load(e.baseImg);this.material=new p.xoR({map:s}),this.mesh=new p.Kj0(this.geometry,this.material),this.mesh.position.set(this.x,this.y,this.z),this.mesh.rotation.set(this.rotationX,this.rotationY,this.rotationZ),this.mesh.receiveShadow=!0,this.mesh.castShadow=!0,this.mesh.name=this.name||this.type,e.container.add(this.mesh),this.dispose=()=>{e.container.remove(this.mesh),this.material.dispose(),this.geometry.dispose()},this.update=e=>{this.mesh.rotation.y+=e}}}const O=t.p+"images/trees57d0b9224e26b78a935d.glb";class V{constructor(e){(0,A.Z)(this,"type","tree"),(0,A.Z)(this,"meshes",[]),(0,A.Z)(this,"cannonBodies",[]),e.gltfLoader.load(O,(s=>{e.treeData.forEach((t=>{const i=new p.Tme;i.copy(s.scene.children[t.type]),i.name=this.type,i.scale.multiplyScalar(.01*t.scale),i.children[0].castShadow=!0,i.children[0].receiveShadow=!0,this.meshes.push(i);const a=(new p.ZzF).setFromObject(i),{x:n,y:o,z:r}=a.getSize(new p.Pa4);i.position.set(t.x,t.y,t.z),i.rotation.set((0,d.Id)(-90),0,0),e.container.add(i);const c=new h.Ab(n/6,n/6,o),m=new h.uT({mass:0,position:new h.AO(t.x,t.y+o/2,t.z),shape:c});this.cannonBodies.push(m),e.world.addBody(m)}))})),this.dispose=()=>{this.cannonBodies.forEach((s=>{e.world.removeBody(s)})),this.meshes.forEach((s=>{e.container.remove(s)}))}}}class M extends p.CP7{constructor(e){super(e),(0,A.Z)(this,"setDefaultSize",(()=>{this.setSize(this.domElement.offsetWidth,this.domElement.offsetHeight)})),this.setPixelRatio(window.devicePixelRatio>1?2:1),this.setSize(this.domElement.offsetWidth,this.domElement.offsetHeight),this.shadowMap.enabled=!0,this.shadowMap.type=p.ntZ}}const W={srcSet:t.p+"responsive-images/nx-43e918c16cf8d470-320.png 320w,"+t.p+"responsive-images/nx-9446f5bd9f92febc-640.png 640w,"+t.p+"responsive-images/nx-51a4b9e5a15f420f-960.png 960w,"+t.p+"responsive-images/nx-63f5b62a3f3cb080-1024.png 1024w",images:[{path:t.p+"responsive-images/nx-43e918c16cf8d470-320.png",width:320,height:320},{path:t.p+"responsive-images/nx-9446f5bd9f92febc-640.png",width:640,height:640},{path:t.p+"responsive-images/nx-51a4b9e5a15f420f-960.png",width:960,height:960},{path:t.p+"responsive-images/nx-63f5b62a3f3cb080-1024.png",width:1024,height:1024}],src:t.p+"responsive-images/nx-63f5b62a3f3cb080-1024.png",toString:function(){return t.p+"responsive-images/nx-63f5b62a3f3cb080-1024.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAA/1BMVEWAg5FQZpNNYo85UIM5R2s2S36FiJdZXnQ5RmUrNlc+SmpVYH2GiJRWbJaOkJ2Cj6ednadmdZdCS2UwO1xJV3iKkJ5TaJR3hqOUmac/VYdTWnBcYnZTXnpPV3BdZHqJi5hofKGIk6hKXINHXo1zgJ+wsr1MU2pGUGxGU3FCTm9aZ4MyP2N2eottc4dTZIaQlKJYcJp+jaiMjZhzg6NYa41Sapdcc51AWYyMk6d+iqRvfJiQl6qfpLReb5VOWXU3QV9iaHxvd40/T3V5gJSSlqJqgKRjd55JZJShoq9ncIhiaoByf5Zuhaanpq2pqrU9RV5PXHxocop/iZuVn7WKkqLLleHlAAAACXBIWXMAAAsTAAALEwEAmpwYAAABVUlEQVR4nE3J1ZqCUBRA4Y0e4UijIKB02AF2gN019f7vMp/OzazLf0Eul8t5c2GhheEikXyixI0P8MJs1htKgZAGaYYocT8hZN/puiT5mUzmhW4Cuq5n9XSWJM/0bQSnxlCaTCb+VDs/wzDwCYJzgkEMM+408TlJmgfujCuNjqo6UEELouPxdBqPCPUccFEUjZ0D9KauKAqqOHVmZ2HsOIf7PQalJ/Z48SGKj4XrCto0FoQF2CRJ2naf53leURR+v9f2GrxjWZJ8XdLuK7zSewkA22fZPuxum91ufrt9Q3uzabc7l3aneYEvr9vtDocSdBiZYWTZYoxrh9luZc/rDsFoIETXl5S1vlp1hLbyJ9MEutVq4Vq5sl5bJo0QashGE1rFYnFVMKmKRZkNjBFdN5qQz+eLq0K1TFUos0ZjjBpL5j+WqwWMMV033vjxh5RZK2BM15a/VKgv5JJ/sLMAAAAASUVORK5CYII=",width:1024,height:1024},C={srcSet:t.p+"responsive-images/ny-881fdf54cdf09324-320.png 320w,"+t.p+"responsive-images/ny-bb63b47858447ab1-640.png 640w,"+t.p+"responsive-images/ny-c01077fb2f78a75c-960.png 960w,"+t.p+"responsive-images/ny-cbef64bf97114415-1024.png 1024w",images:[{path:t.p+"responsive-images/ny-881fdf54cdf09324-320.png",width:320,height:320},{path:t.p+"responsive-images/ny-bb63b47858447ab1-640.png",width:640,height:640},{path:t.p+"responsive-images/ny-c01077fb2f78a75c-960.png",width:960,height:960},{path:t.p+"responsive-images/ny-cbef64bf97114415-1024.png",width:1024,height:1024}],src:t.p+"responsive-images/ny-cbef64bf97114415-1024.png",toString:function(){return t.p+"responsive-images/ny-cbef64bf97114415-1024.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAmVBMVEVSWGw+RVxHTWIsNVE8Q1ozO1VVW25DSV9YXnFOVGc5QFgwOFJMVGw2PVdKUGRcYnU+SWZgZ3tDT2xGT2hHVHFKWHVsc4ZMW3pyeY28vshQWHBkbIBve5WorLmaoLC0t8JCS2VaYnlUXXVkcIl+hZaMkaKCi6GVmqt4gJRPX4FXZ4Zico+jp7aMlatpb4BaZX6CiZt4hZ+vs79xNgzyAAAACXBIWXMAAAsTAAALEwEAmpwYAAABEElEQVR4nE3O246DIBCA4bEFFVSqgCfq+dyurbbv/3Cb0Wyy/80k30wIEMdpmqaPx/On+Lyqb57ndQlSax3H6Ylrnef5d4VQSq1PnOayxsMKwlBKqeP02R9Yf8vqBSGqjrutL/Z5Lcu1ek0QNo2S2nRbnw3jXFXzOH1AKaV833TtPVn2cRynfSnA+L7vG9O1UZItwzAMS5GBa9sAYLu36P5OsqMeXNe1Ed3bLXq/EwzxPD05umOAd4wxOBfo0QZIQgjBMMDztgUmxOUvwfDxroOL8y/BAIwxYBFCrCNCLEcw/DYEQcA5IYRwzonlXIRSCiilFJ0HlAacOI7TNHC9ep6HG4oz4MSyQrhiHnbMg38BEfIcfGbXQYMAAAAASUVORK5CYII=",width:1024,height:1024},k={srcSet:t.p+"responsive-images/nz-620af6dbf8199423-320.png 320w,"+t.p+"responsive-images/nz-167c532bc40d0898-640.png 640w,"+t.p+"responsive-images/nz-7eeb397af90ad63e-960.png 960w,"+t.p+"responsive-images/nz-e86097d9259b4137-1024.png 1024w",images:[{path:t.p+"responsive-images/nz-620af6dbf8199423-320.png",width:320,height:320},{path:t.p+"responsive-images/nz-167c532bc40d0898-640.png",width:640,height:640},{path:t.p+"responsive-images/nz-7eeb397af90ad63e-960.png",width:960,height:960},{path:t.p+"responsive-images/nz-e86097d9259b4137-1024.png",width:1024,height:1024}],src:t.p+"responsive-images/nz-e86097d9259b4137-1024.png",toString:function(){return t.p+"responsive-images/nz-e86097d9259b4137-1024.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAsVBMVEUoMlCGiJYzSHwrNVI4T4MqN1o1S38nMlMvQ3YxRXk9VYkxPmM8UoUnM1ZNWHR8f4+Ji5g1SHgvOlxLY5Jocopwd4pwgJ2AiqA0QWRXYn2EhpF+gY+cn6mEjqNnd5p3hZ86RWZBUHReaYGVmKWBg5KOk6F6iaNUbZg1QF5GXo9UZIWMjpsvOFY9SWtGUG49S29BWoxRXXtabpZpfp9DVXpbc5xfd540RGtga4NTZY9yepCS36ERAAAACXBIWXMAAAsTAAALEwEAmpwYAAABJUlEQVR4nDWJB3KDMBBFFwEiEiBEF6b34oZrnNz/YBkR+83O/v1vwcKYfEmI67quTIKAWhoiH0kIIQhjmKmFkSwuQoQghLGmQe5TS8MIyYqlsSwKbeSvVJO3tm1K/SuU0dWfV/rTFhqldF1nvxjg+Xg+fP9aFHMZFXExjuNYwjBkWX5r22jM4yGP81t0KyHL2jbr+z4uo7iMhjjO+x72+z1XOFc+cM45cK7sdrsuTR1Jmnad0sHmnNQJg0BO+PvrdBAEqRMkYZjcmyZ5Na9lWQJYLsmlPjPGzoydLqyu63sDCauPwjSrUyWEKYQQ32cGyakyPV33Jk//xxRHYNLZhqqqhmHYtm3rnglHIR1sGBLb1qGavIP6lu+HDdPkHQ6qCgCqZNN/yH4eNUrYw/kAAAAASUVORK5CYII=",width:1024,height:1024},T={srcSet:t.p+"responsive-images/px-9a433e2bae10046c-320.png 320w,"+t.p+"responsive-images/px-4aedb22733aa38dd-640.png 640w,"+t.p+"responsive-images/px-3cfb1b479d7e767e-960.png 960w,"+t.p+"responsive-images/px-582c623f49d7de70-1024.png 1024w",images:[{path:t.p+"responsive-images/px-9a433e2bae10046c-320.png",width:320,height:320},{path:t.p+"responsive-images/px-4aedb22733aa38dd-640.png",width:640,height:640},{path:t.p+"responsive-images/px-3cfb1b479d7e767e-960.png",width:960,height:960},{path:t.p+"responsive-images/px-582c623f49d7de70-1024.png",width:1024,height:1024}],src:t.p+"responsive-images/px-582c623f49d7de70-1024.png",toString:function(){return t.p+"responsive-images/px-582c623f49d7de70-1024.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABQVBMVEWJosSTnrRbb5KBjqqvtL2Ll66/xMxgbIdKYI9IUm6ZorWXsM+RnLKorbiPmq+Lj5xNW3pQX4B9lrqQqcq4v8q7wMhshKussbyjqbd7hJhyhaWRlaFeeKGanqk/SWVDTWlNWHV1j7RTZIZqfJxkdJFWX3dhdplvh62yucNka4B0iKhsdYtmfKG0vc6ftdFygqJDWIl7jauGi5pSaJWHlal4hqS2tr1JVXCAmr9RXHZZZH9UYH1VaY1icIxrgKGDnL6ossO3u8Ryi7BqcYd6kbSfsMedqLvGy9KqtciWq8dngKdZcZt1fpJ2jK6TmKajpa9UbJlcaIR5k7iLmLBYaIiGn7+GocKWprp8iKBuepWksMK8xtLFzdypuc6Gm7mElK6PoruGkKiWnrBxf5pqeJOAip9weZCLpca1wtZja4OnpaxydQ/2AAAACXBIWXMAAAsTAAALEwEAmpwYAAABcUlEQVR4nB3K5VbCABiA4W8sWRIbrAEB6W5RuqVUQsBWRL3/C/CM9+dzXmAYhnFD9T7Qm0WStwWKymazkE4zbjdUXYFOxKNbSFFZeHr6Sbuh6QpEPBN9uVwWKKoAo1QqxcCmet/xTPScepvJlDjYj8TW+LSx1sjkVUXL5fICnvtjANisXb2OZzZjvR8f7yV4TvfHJ9ism64e4pXZXCmp63A4DInUSOy/vbwM6Fyc51Ueh+GQkAhCjO4HW1nmi8Wi8WcAQRBSux2NYpiXWxjGXNMEASRJapct4eSFMdcEQcjnQRSjGIZxMosX59pRUZS8JkCr5eVohH5VG8FjfheaTm+UKWwR5CEXjzcubbad8p1IJEiSBPYBR+ON5KXt+mJFkmQ30e3+AsvjqHo2p9NZr1/FYrEYICyOqsEzOhwOv78WDoeBZnE0EwzZVhb6K3YroBEcLQVDN+TdVb3mr9h9PtOEAc2/P35+nTVcq9h9pmn+Az9/PqXb36LAAAAAAElFTkSuQmCC",width:1024,height:1024},L={srcSet:t.p+"responsive-images/py-f22d663e9d68076d-320.png 320w,"+t.p+"responsive-images/py-7a3f2b125700b943-640.png 640w,"+t.p+"responsive-images/py-9419883ae8b47c29-960.png 960w,"+t.p+"responsive-images/py-6a1c0fd8c6b43d39-1024.png 1024w",images:[{path:t.p+"responsive-images/py-f22d663e9d68076d-320.png",width:320,height:320},{path:t.p+"responsive-images/py-7a3f2b125700b943-640.png",width:640,height:640},{path:t.p+"responsive-images/py-9419883ae8b47c29-960.png",width:960,height:960},{path:t.p+"responsive-images/py-6a1c0fd8c6b43d39-1024.png",width:1024,height:1024}],src:t.p+"responsive-images/py-6a1c0fd8c6b43d39-1024.png",toString:function(){return t.p+"responsive-images/py-6a1c0fd8c6b43d39-1024.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABGlBMVEUvQnVccpqFnsG9v8gxRHczR3hZbpc2SXtUaZOctNJcaYulqLa0t8G4usRedp6PqMhnfqQ8U4WBmr0sP3Nwepd8hJ2Mk6k7TXugpLKboK9heaFshqzg4uhLWoPDxc3S0terrbiTmKpVY4hvirF3kbaZr82iuNStv9fW3OZ7k7euu85QZY++w89AUn7NztShp7iYnKyytcBGWYOPlaeZprxre5yco7VgbpBogac4TYG8ydzJ0d/6+fny8vRLYYy5vstEW4u2u8rGy9bP09t1iquws72lrLyFi6F1gp+Urcynu9d0j7SotMiyt8SMmrGVnbGrsb+Dk62XobVXaY3n6O2BjKfv8PPN1eJ+l7fY2Nt6h6NndJXFyNCRp8Texu1xAAAACXBIWXMAAAsTAAALEwEAmpwYAAABZklEQVR4nCXL1XbCUBRF0RO9UeJGQgyKBQ1a3KHUXf//OzrS7sc51gaKIiEbRZKggQYkulTgzzTUTAsUaBpVaGaIsgRxuqFbJFXQDe5SUQAhhCy9Y/CmBVwY9cxEWUGKyMKow3OiSaHYjpxwoKygZ46aRtjjjNiyYl4UhHsmgb3gxEfb4o5x2hx1hbArtGWwzW894nWu5zjP6cnpdMT1DnjBNPjjKCKC4SI5hbZD9GXwiWF0uE/toP08GDzsbf620QdC9Nvi8CS2nh7FQ3/f9VubPghE92s4eAh+7p4+W0u/tb1Rr4Fo0wmD3R0edzfbW8IPNmqtBq/YgqFz8q72Ua83gmWjgas4rBYMg+XHbkmV6tvNer2s4zgkTBa6xRouse+e53lTSQKGobG87F6r0hVbqc7e5tUyCzSN5fLjYgm/uGAr0/lsXj2zkJns/uN54s1eJmUWsFwuP3aLpezOnifVaaXM/gK9pjMT1+ivhQAAAABJRU5ErkJggg==",width:1024,height:1024},X={srcSet:t.p+"responsive-images/pz-10f488cd9e60ca04-320.png 320w,"+t.p+"responsive-images/pz-56fe2eb414b5f4e6-640.png 640w,"+t.p+"responsive-images/pz-d229405ea56feb25-960.png 960w,"+t.p+"responsive-images/pz-0050c5a4c59e08ac-1024.png 1024w",images:[{path:t.p+"responsive-images/pz-10f488cd9e60ca04-320.png",width:320,height:320},{path:t.p+"responsive-images/pz-56fe2eb414b5f4e6-640.png",width:640,height:640},{path:t.p+"responsive-images/pz-d229405ea56feb25-960.png",width:960,height:960},{path:t.p+"responsive-images/pz-0050c5a4c59e08ac-1024.png",width:1024,height:1024}],src:t.p+"responsive-images/pz-0050c5a4c59e08ac-1024.png",toString:function(){return t.p+"responsive-images/pz-0050c5a4c59e08ac-1024.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABKVBMVEWctNKapbhvgqJleZymrLpdaoWdp7qIl7DDytSOqMmdqL2Urs6SorvCyNCYstHBxcxMXX9QY4Zpc4u8wsp/jai2vsmgq79fc5WOnbWYpryVoLWxt8OkudSQm7CkqLN0iq2bqb+7xtWgttO5vsetsbtTX3xUaIujsMNzjrVoeJZhcI5Ya49zgJmAm79tiLCos8WGmbW+xMycrMKNob2FmrqHk6irvdWgpK6xuciwwNV7kLKessy2w9XG0NxccJKEnsJibYV0fZOts8J5gpi3u8Z4k7h7lrypsMCIo8acoKtrfp6Bl7eYnatuhKetvdC/y9x7jaxYYnxwfJSPlKJ8iaC0vcqLpMR0h6Rog6vN0dymtstkgKmructeeaVaZoGOmKqWrMq5w8+ClLCSOMuGAAAACXBIWXMAAAsTAAALEwEAmpwYAAABbUlEQVR4nC3L51aCABiA4Q9lyVRQWTIE3OTeYpla7pWZo33/N9Gx+vuc9wVi0n0/FbMPN3chmrObnWbCBlC12PtrsZh9vJmGaLATts3RsER56/X0jxwAcLABHXX5Uve6T0M0zQHHbZKw1dGxU6o9XEu/DwD9cxu2K5OhFvX6S+jlyz8n7E3f92FlmmZ3UWfabK9HJpuJZqezBoIgEGZRY6xLr3dZd/wk2U9Cy1ARXKGU6tvb+pslSZJlSZi1Wobhuq7mVHieZVm2wvOwnC1nLcNAXc1xHLFSEUVRhP2+0fhsEISMW/Fh+3A4xGIx8Dzv+XkeODbkclmpVjMlrV2CfF568nLBeVTfdvF4rWZlMhZg+dxolJOk+TFgqpRcVzJxBAbC/cgTCgUpGFwRarnMUH94L2DpdEEKBqKELDMKhQA2EAQsEokUbq+o4nEKR2D3gX2kwuFI+oo6PhlOUBxSu1Qq/Iu5QFRHtfF4iP4Aup07icd++pkAAAAASUVORK5CYII=",width:1024,height:1024},j=t.p+"images/greenaryeac3b060f7439b9f16f1.glb";var R=t(2731);const Y=2,F=2,N=.05,J=[{x:55,y:4,z:55}],Q=[{type:0,x:61,y:0,z:19,scale:1.5},{type:0,x:68,y:0,z:17,scale:2},{type:0,x:76,y:0,z:17,scale:1.7},{type:0,x:59,y:.5,z:24,scale:1.8},{type:0,x:66,y:.5,z:23,scale:2},{type:0,x:72,y:.5,z:21,scale:2.1},{type:0,x:80,y:0,z:22,scale:1.9},{type:0,x:63,y:1,z:27,scale:1.75},{type:0,x:81,y:.5,z:26,scale:1.95},{type:0,x:64,y:1.3,z:33,scale:1.75},{type:0,x:70,y:1.3,z:31,scale:1.8},{type:0,x:75,y:1.3,z:32,scale:1.82},{type:0,x:80,y:1.3,z:31,scale:2},{type:6,x:81,y:10,z:73,scale:2},{type:17,x:82,y:6.7,z:65,scale:1.8},{type:14,x:76,y:6.7,z:82,scale:1.7},{type:7,x:59,y:8,z:72,scale:1.9},{type:26,x:51,y:8,z:80,scale:1.6},{type:23,x:65,y:6,z:89,scale:1.4},{type:28,x:91,y:0,z:28,scale:2},{type:28,x:96,y:0,z:37,scale:1.8},{type:28,x:98,y:0,z:45,scale:1.9},{type:28,x:96,y:0,z:53,scale:2},{type:28,x:97,y:0,z:61,scale:1.85},{type:28,x:38,y:0,z:88,scale:1.85},{type:18,x:30,y:1.5,z:28,scale:2.1},{type:2,x:40,y:.3,z:25,scale:1.7},{type:2,x:47,y:0,z:24,scale:1.8},{type:1,x:23,y:.5,z:43,scale:1.8},{type:1,x:24,y:.5,z:51,scale:1.9},{type:1,x:28,y:.5,z:48,scale:1.85},{type:24,x:63.2,y:0,z:43.3,scale:1.8},{type:19,x:70,y:0,z:45,scale:1.7},{type:24,x:31,y:1,z:60,scale:1.85}],H=e=>{let{canvas:s,loadingManager:t,gallery:i,frameList:a}=e;const n=new p.dpR(t),o=new p.cBK(t),r=new c.E(t),A=new M({canvas:s,antialias:!0}),g=new p.xsS;g.background=o.load([T,W,L,C,X,k]);const l=new h.q3;l.broadphase=new h.BQ(l);const w=new m({canvas:s});w.position.set(25.1,5,25.1),w.rotation.set(0,(0,d.Id)(-135),0),g.add(w);const u=new q(s,w,l,1.6);u.raycast=e=>{"frame"===e.object.name.slice(0,5)&&(e.distance>10?R.Z.addToast("error","너무 멂"):R.Z.addToast("success",e.object.name))};const y=[],f=new p.Mig("white",.5);g.add(f),y.push(f);const b=new p.Ox3("white",1.8);b.position.set(110,220,110),b.shadow.camera.left=-60,b.shadow.camera.right=60,b.shadow.camera.top=60,b.shadow.camera.bottom=-100,b.castShadow=!0,g.add(b),y.push(b);const v=[];r.load(j,(e=>{const s=e.scene.children[0];s.receiveShadow=!0;const t=(new p.ZzF).setFromObject(s),{x:i,y:a,z:n}=t.getSize(new p.Pa4);s.position.x+=i/2,s.position.z+=n/2,g.add(s),v.push({dispose:()=>g.remove(s)}),u.floors.push(s),u.rayItems.push(s)}));const x=new p.DvJ(530,5,530),B=new p.YBo({color:36081,side:p.ehD}),Z=new p.Kj0(x,B);Z.position.set(55,-3.5,55),g.add(Z),u.rayItems.push(Z),v.push({dispose:()=>{x.dispose(),B.dispose(),g.remove(Z)}});const z=new h.xu(new h.AO(55,50,1)),E=new h.uT({mass:0,position:new h.AO(55,0,-1),shape:z});l.addBody(E);const U=new h.xu(new h.AO(55,50,1)),S=new h.uT({mass:0,position:new h.AO(55,0,109),shape:U});l.addBody(S);const K=new h.xu(new h.AO(1,50,55)),O=new h.uT({mass:0,position:new h.AO(-1,0,55),shape:K});l.addBody(O);const H=new h.xu(new h.AO(1,50,55)),D=new h.uT({mass:0,position:new h.AO(109,0,55),shape:H});l.addBody(D),v.push({dispose:()=>{l.removeBody(E),l.removeBody(S),l.removeBody(O),l.removeBody(D)}});const G=new p.fHI(17,17,5),P=new p.YBo({color:775167,side:p.ehD}),_=new p.Kj0(G,P);_.position.set(45,-3,43),g.add(_),u.rayItems.push(_),v.push({dispose:()=>{G.dispose(),P.dispose(),g.remove(_)}});const $=new V({container:g,world:l,gltfLoader:r,treeData:Q});v.push($),u.rayItems=[...u.rayItems,...$.meshes],J.forEach(((e,s)=>{const t=new I({name:"frame-".concat(a[s].frameId),x:e.x,y:e.y,z:e.z,width:Y,height:F,depth:N,container:g,textureLoader:n,baseImg:a[s].framePictureUrl});v.push(t),u.rayItems.push(t.mesh)}));const ee=new p.SUY,se=function(){const e=ee.getDelta();let s=1/60;e<.01&&(s=1/120),l.step(s,e,3),u.update(e),v.forEach((s=>{s.update&&s.update(e)})),A.render(g,w),A.setAnimationLoop(se)};se();const te=function(){w.setDefaultAspect(),w.updateProjectionMatrix(),A.setDefaultSize(),A.render(g,w)};window.addEventListener("resize",te);return{dispose:function(){y.forEach((e=>{g.remove(e),e.dispose()})),v.forEach((e=>{e.dispose&&e.dispose()})),g.remove(w),A.setAnimationLoop(null),A.dispose(),u.dispose(),window.removeEventListener("resize",te)}}},D={srcSet:t.p+"responsive-images/2d-99d385f359af40ec-320.png 320w,"+t.p+"responsive-images/2d-51aa8be7e286b9e7-380.png 380w",images:[{path:t.p+"responsive-images/2d-99d385f359af40ec-320.png",width:320,height:397},{path:t.p+"responsive-images/2d-51aa8be7e286b9e7-380.png",width:380,height:472}],src:t.p+"responsive-images/2d-51aa8be7e286b9e7-380.png",toString:function(){return t.p+"responsive-images/2d-51aa8be7e286b9e7-380.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAZCAMAAAAGyf7hAAAAyVBMVEXd3dxjY2RgYWLc3N/b29vg4ODh4eLd3d1nZ2doaGhkZmrk5OPU1NVgX2BqamlmZmazs7Lc3uOfn59oaGrh4uXe3t6QkJHj3tLAwMCHh4doZ2br05fl5ebp1qWGdk51dXXk5urpzoixoHTszXzDqGVtaFzm28He3NfT0s/DxMaRfETo27eFeFji2sZ8cVN3blSJi5HHx8fk1rOws7rWunO6nVLeuVvMu47JqVPayqGkhztnYlTMqEump6lhXlWjkF/Lpkioij3X2d79F2ZCAAAACXBIWXMAAAsTAAALEwEAmpwYAAABN0lEQVR4nG3Q146DQAwFUDPjaZQhJLQQCCG997K9/P9PrQgQ5WHvk3UkW9YFKZXTtmg0GoFoAjVuitGMgoBnRHqc3g0aJO0UwfNAIJ1RvGNibscrCgAC/GmxGkCFy5eeV47W5/fPZW8HUK5PhhEFITDdf/UnZM7u6LTT8hKmITFd/UALhQCaXXYq6dgcn7H30Tdd/RrR5iUBSKOhocx10SvXzd14SiEIYBA62lwXmQCtO8txRtG2bQgd7XbmjAIh5H0Y8UOe57l2pattBhCGYffks4U0XMOVsnrJsiyLIT9oZSZmg4iIAHyRGNvfvuEaqsSq1sCO49v1HMdxjEHdqgDBORwjzjj3KNbIOWPM54zxWbbxq6aDuFXndLueWxXyrmNUIZO3PmmQaFVFKqkeqGSTRP6DUv4BgZ0ckUcj224AAAAASUVORK5CYII=",width:380,height:472},G={srcSet:t.p+"responsive-images/3d-8e07d3dd2b0a80c5-124.png 124w",images:[{path:t.p+"responsive-images/3d-8e07d3dd2b0a80c5-124.png",width:124,height:124}],src:t.p+"responsive-images/3d-8e07d3dd2b0a80c5-124.png",toString:function(){return t.p+"responsive-images/3d-8e07d3dd2b0a80c5-124.png"},placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABCFBMVEVMaXHNzc3AwMCfn5+pqanc3NyysrLX19fY2NjW1tbFxcWdnZ2np6fKysrU1NSfn5/S0tLOzs7j4+PQ0NCWlpbp6enOzs7l5eWXl5empqbDw8OwsLCtra3Pz8+urq7Hx8esrKzr6+u0tLTNzc3Kysrr6+vY2NiSkpLl5eXw8PC/v7+ysrKurq7U1NTS0tKsrKyxsbHT09PMzMzV1dXS0tKsrKyvr6/o6OjPz8+YmJiKioq9vb3U1NSfn5+YmJj29vaPj4/IyMiQkJDl5eXDw8P////q6uqOjo65ubnKysrU1NTj4+POzs61tbXR0dHKysr7+/v39/ff39/BwcG5ubm4ubmjo6OsrKwnYYVlAAAAVnRSTlMA+4kS/v7+AQIF/v38EYRf/CYV+/3SyLiXmoJoijX7j+RF9lRC/fr7i/thKHtmyrFF5Zek78uWT6g0XPu26u0+ie5KbsAi5RkL1P///////////////mpBzjgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAETSURBVHicZZHXbsMwFEPpWLIk29l779W9d5vuIe+kSf//TwobbtOgfDwgCF5eIBbHPwmBXKq/gbiA2D205kdga8gw2LNo3i0J/kMZkseUZjzdKwnwOJsjvVCktD23zbMCIjILpAuGY8uHfvZGXmSjXC6QJsaY2M+o6go9SSWjxPPc1a1p0hIqmpLPzGsAmkW/2FXvyccAVTlyFTsBICFpEJRf3t6BiqHZGRrChtbSLX86yQHV1di4dkO4s9BMLT8MXp/weLcqmLIdNqp3li2yHE2D4kytFJbeVnSQ2uh9ErKYB/4El2fNqChj2N53HPNLGZZDz3rLg1OH9Kwy2O8koVnUO7qV+rsdwBnUWneTxf+I2TeZayAPaT/EPwAAAABJRU5ErkJggg==",width:124,height:124},P={galleryId:1,name:"갤러리1",content:"대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.",createdDate:"2023-08-03 23:59:59",modifiedDate:"2023-08-04 00:59:59",place:{placeId:1,name:"Gallery A",maximumFrameNumber:10,threeDimensionImageUrl:G,twoDimensionImageUrl:D}},_=[{frameId:1,order:1,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:2,order:2,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:3,order:3,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:4,order:4,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:5,order:5,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:6,order:6,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:7,order:7,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:8,order:8,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:9,order:9,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}},{frameId:10,order:10,title:"액자 제목",content:"액자 설명",framePictureUrl:"https://source.unsplash.com/500x500",createdDate:"2023-08-03T23:59:59",modifiedDate:"2023-08-04T00:59:59",music:{musicId:1,title:"비밀번호 486",singer:"윤하",releasedDate:"2023-08-03T23:59:59",videoUrl:"https://www.youtube.com/embed/iEfIcJHEb70?si=Lqv77NhgOQfHZfkp",thumbnailUrl:"https://source.unsplash.com/500x500"}}];var $=t(2914),ee=t(2233);const se={1:H},te=()=>{const e=(0,r.useRef)(null),s=P,t=_,[i,a]=(0,r.useState)(0),[o,h]=(0,r.useState)(0);(0,r.useEffect)((()=>{if(!s||!t)return;const i=e.current,n=new p.lLk;n.onStart=function(){a((e=>e+1))},n.onLoad=function(){h((e=>e+1))};const{dispose:o}=se[s.place.placeId]({loadingManager:n,canvas:i,gallery:s,frameList:t});return()=>{a(0),h(0),o()}}),[s,t]);(0,r.useRef)(null);return(0,r.useEffect)((()=>void 0),[]),(0,n.jsxs)("div",{className:"gallery-canvas",children:[(0,n.jsx)("canvas",{ref:e}),(0,n.jsx)($.Z,{className:"gallery-canvas__loading",isShow:i!==o,duration:1e3,timingFunction:"ease-in-out",children:(0,n.jsx)(ee.Z,{})})]})},ie=()=>(0,n.jsxs)("div",{className:"gallery",children:[(0,n.jsx)("div",{className:"gallery__navbar",children:(0,n.jsx)(o,{})}),(0,n.jsx)("div",{className:"gallery__canvas",children:(0,n.jsx)(te,{})})]})}}]);
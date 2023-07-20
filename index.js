import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js"

const firebaseConfig = {
  apiKey: "AIzaSyDGiTUzVu9rQ989VOzfy7-VVE_malR1AoM",
  authDomain: "carrito-b8af6.firebaseapp.com",
  databaseURL: "https://carrito-b8af6-default-rtdb.firebaseio.com",
  projectId: "carrito-b8af6",
  storageBucket: "carrito-b8af6.appspot.com",
  messagingSenderId: "26507181196",
  appId: "1:26507181196:web:c7893e315af37bf460cfa9"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const carritoDB = ref(database, "carrito")

const input = document.getElementById("input-field")
const button = document.getElementById("add-button")
const list = document.getElementById("shop-list")
const alerta = document.getElementById("alerta")
const listavacia = document.getElementById("lista-vacia")
const aviso = document.getElementById("aviso")

if(list.innerHTML === ""){
    listavacia.innerText = "Aun no hay nada aqui!"
}

function resetTexts(){
    input.value=""
    alerta.innerText =""
}

function actualizarLista(){
    list.innerHTML=""
    onValue(carritoDB, function(snapshot){
        if(snapshot.exists()){
            let carritoArray = Object.entries(snapshot.val())
            let nuevaLista = carritoArray.map(item => {
                let newItem = document.createElement("li")
                let itemId = item[0]
                newItem.classList.add("item-lista")
                newItem.textContent = item[1]
                let location = ref(database,`carrito/${itemId}`)
                newItem.addEventListener("dblclick", ()=>{
                    remove(location)
                    newItem.remove()
                    actualizarLista()
                    aviso.innerHTML = `Removido el item "${newItem.textContent}"`
                })
                return newItem
            })

            for(var i=0; i<nuevaLista.length; i++){
                let currentItem = nuevaLista[i]
                list.appendChild(currentItem)
            }
        }
    })  
}

actualizarLista()

button.addEventListener("click", ()=>{
    let value = input.value
    if(value !== ""){
        push(carritoDB, value)
        //list.innerHTML += `<li>${value}</li>`
        actualizarLista()
        resetTexts()
    }else{
        resetTexts()
    }
})
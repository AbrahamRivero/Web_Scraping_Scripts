import fetch from 'node-fetch'
import { load } from 'cheerio'
import fs from 'fs'

// URL de la página que deseas extraer las imágenes
const url = 'https://www.monsterhunter.com/rise-sunbreak/en-us/monster/'

// Realizamos una petición HTTP utilizando node-fetch para obtener el contenido de la página
fetch(url)
	.then(response => response.text())
	.then(body => {
		// Pasamos el contenido de la página a la librería Cheerio
		const $ = load(body)

		// Obtenemos todas las etiquetas de imagen en la página
		const images = $('img')

		// Creamos la carpeta fetchedImages si no existe
		if (!fs.existsSync('fetchedImages')) {
			fs.mkdirSync('fetchedImages')
		}

		// Recorremos todas las etiquetas de imagen y extraemos el atributo src de cada una
		images.each(function (index) {
			const src = $(this).attr('src')
			console.log(url + src)
			// Descargamos la imagen y la guardamos en disco con nombres consecutivos
			fetch(url + src).then(res => {
				const dest = fs.createWriteStream(`fetchedImages/image${index}.jpg`)
				res.body.pipe(dest)
			})
		})
	})

function GroupBy(array, func) {
	return array.reduce((acc, obj) => {
		const key = func(obj);
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(obj);
		return acc;
	}, {});
}

function sheetToArrayOfObjects(sheet) {
	const sheetData = sheet.getDataRange().getValues();
	const cols = sheetData[0];
	sheetData.shift();

	return sheetData.map((row) => Object.fromEntries(row.map((rowData, i) => [cols[i], rowData])));
}

function sheetToArrayOfStrings(sheet) {
	const sheetData = sheet.getDataRange().getValues();
	sheetData.shift();
	return sheetData.flat();
}

function callToBackend(payload) {
	const options = {
		method: 'post',
		contentType: 'application/json',
		payload: JSON.stringify(payload)
	};

	const res = UrlFetchApp.fetch('', options);
	const content = res.getContentText();
	return content;
}

const call = {
	getDownloadLink: (request) => {
		const spreadID = '1WjVufnSXuRmfJzDkXvZBhLuz67D6JsnhS7MfONwCbfw';
		const spreadSheet = SpreadsheetApp.openById(spreadID);
		const sheet = spreadSheet.getSheets()[parseInt(request.index)];
		return `https://docs.google.com/spreadsheets/d/${spreadID}/export?format=${request.formato}&gid=${sheet.getSheetId()}`;
	},

	email: (request) => {
		const data = request.data;

		// Enviar correo:
		MailApp.sendEmail({
			to: data.para,
			subject: `> ${data.asunto}`,
			htmlBody: data.cuerpo
		});
	},

	updateUsersData: (request) => {
		const sheetDocentes = SpreadsheetApp.openById(
			'1PPjK6xt2l-1X1oe_6h50qi9DPvFPrrhaNof34qxfcu0'
		).getSheetByName('DOCENTES');
		const sheetAdmins = SpreadsheetApp.openById(
			'1PPjK6xt2l-1X1oe_6h50qi9DPvFPrrhaNof34qxfcu0'
		).getSheetByName('ADMINS');
		const sheetUabs = SpreadsheetApp.openById(
			'1PPjK6xt2l-1X1oe_6h50qi9DPvFPrrhaNof34qxfcu0'
		).getSheetByName('UAB');

		const arrayDocentes = sheetToArrayOfObjects(sheetDocentes);
		const arrayAdmins = [...new Set(sheetToArrayOfStrings(sheetAdmins))];
		const arrayUabs = sheetToArrayOfObjects(sheetUabs);

		return JSON.stringify({
			docentes: arrayDocentes,
			admins: arrayAdmins,
			uabs: arrayUabs
		});
	},

	getData: (request) => {
		const spreadSheet = SpreadsheetApp.openById('1PPjK6xt2l-1X1oe_6h50qi9DPvFPrrhaNof34qxfcu0');

		const sheetUAB = spreadSheet.getSheetByName('UAB');
		const sheetLUGARES = spreadSheet.getSheetByName('LUGARES');
		const sheetRIESGOS = spreadSheet.getSheetByName('RIESGOS');

		return JSON.stringify({
			uab: sheetToArrayOfObjects(sheetUAB),
			riesgos: sheetToArrayOfObjects(sheetRIESGOS),
			lugares: sheetToArrayOfStrings(sheetLUGARES)
		});
	},

	getInternal: (request) => {
		const spreadSheet = SpreadsheetApp.openById('1PPjK6xt2l-1X1oe_6h50qi9DPvFPrrhaNof34qxfcu0');

		if (request.data === 'lugares') {
			const sheet = spreadSheet.getSheetByName('LUGARES');
			return JSON.stringify(sheetToArrayOfStrings(sheet));
		}

		if (request.data === 'uab') {
			const sheet = spreadSheet.getSheetByName('UAB');
			return JSON.stringify(sheetToArrayOfObjects(sheet));
		}

		if (request.data === 'riesgos') {
			const sheet = spreadSheet.getSheetByName('RIESGOS');
			return JSON.stringify(sheetToArrayOfObjects(sheet));
		}
	},

	updateUsers: (request) => {
		const result = updateUsers();
		return result;
	},

	genReporte: (request) => {
		const keys = {
			Correo: 'email',
			'Nombre completo del docente a cargo de la práctica': 'docente',
			'Nombre de la Asignatura': 'asignatura',
			'Código de la Asignatura': 'codigo',
			'Pregrado/Posgrado': 'nivel',
			'¿La salida está contemplada en el programa oficial de la asignatura?': 'contemplada',
			'Porcentaje de la práctica en la nota total de la asignatura': 'porcentaje',
			'Pertinencia de la práctica': 'pertinencia',
			'Objetivo de la práctica': 'objetivo',
			'Alcance de la práctica': 'alcance',
			'Lugar de destino de la práctica': 'destino',
			'Descripción de la actividad': 'descripcion',
			Riesgos: 'riesgos',
			'Número mínimo de estudiantes a participar.': 'asistentes',
			'Fecha de salida': 'fechaSalida',
			'Fecha de regreso': 'fechaRegreso',
			'Requerimientos adicionales': 'requerimientos',
			'Justificación de los requerimientos': 'justificacionRequerimientos',
			'Pertinencia de los requerimientos': 'pertinenciaRequerimientos'
		};

		const data = JSON.parse(request.data);

		const date = new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' });
		const titulo = `Consolidado ${date}`;
		const docID = DocumentApp.create(titulo).getId();

		const documento = DocumentApp.openById(docID);

		const groupByDep = (array) => {
			return array.reduce((acc, obj) => {
				const key = obj.comite;
				if (!acc[key]) {
					acc[key] = [];
				}
				acc[key].push(obj);
				return acc;
			}, {});
		};

		const agrupado = groupByDep(data);

		Object.keys(agrupado).forEach((dep) => {
			const titulo = documento.getBody().appendParagraph(dep);
			titulo.setHeading(DocumentApp.ParagraphHeading.HEADING2);

			agrupado[dep].forEach((registro, i) => {
				const row = Object.keys(keys).map((key) => {
					if (keys[key] === 'riesgos') {
						return [
							key,
							Object.entries(GroupBy(registro.riesgos, ({ nivel }) => nivel))
								.map(([nivel, riesgos]) => `${nivel}: ${riesgos.map((r) => r.riesgo).join(', ')}`)
								.join('\n')
						];
					}

					return [key, registro[keys[key]]];
				});
				registro.agenda.forEach((dia, j) => row.push([`Día #${j + 1}`, dia]));

				documento.getBody().appendParagraph(`${i + 1}.`);
				documento.getBody().appendTable(row);
			});

			documento.getBody().appendHorizontalRule();
		});

		// Procesar documento
		const folder = DriveApp.getFolderById('1-0STrPlH70AdtXT3ciyo9SyH66lCnhKL');
		DriveApp.getFileById(docID).moveTo(folder);

		return docID;
	}
};

// Maneja las solicitudes y realiza la llamada a la función correspondiente
function doPost(query) {
	const request = JSON.parse(query.postData.contents);
	try {
		return ContentService.createTextOutput(call[request.type](request));
	} catch (error) {
		return ContentService.createTextOutput('Error, solicitud invalida');
	}
}

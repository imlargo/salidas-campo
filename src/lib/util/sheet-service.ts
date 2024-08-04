import { write, utils } from 'xlsx';

export function ArrayToExcel(array: string[][], name: string) {
	const fileType =
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
	const workSheet = utils.aoa_to_sheet(array);
	const workBook = {
		Sheets: { data: workSheet, cols: [] },
		SheetNames: ['data']
	};
	const excelBuffer = write(workBook, { bookType: 'xlsx', type: 'array' });
	const fileData = new Blob([excelBuffer], { type: fileType });
	const blobUrl = URL.createObjectURL(fileData);
	const link = document.createElement('a');
	link.href = blobUrl;
	link.download = `${name}.xlsx`;
	link.dispatchEvent(
		new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: window
		})
	);
}

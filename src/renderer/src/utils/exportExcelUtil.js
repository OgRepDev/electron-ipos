import * as XLSX from 'xlsx'
export const exportExcel = (data) => {
  const currentDate = new Date()
  const dateString = currentDate.toISOString().split('T')[0] // Pobierz datę w formacie 'RRRR-MM-DD'
  const fileName = `packs_${dateString}.xlsx` // Nazwa pliku z datą

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Packs')

  // Wygeneruj plik Excela
  XLSX.writeFile(wb, fileName)
}

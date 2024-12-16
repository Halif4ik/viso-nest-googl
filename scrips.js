function onEdit(e) {
    try {
        console.log('on e-:', e);
        const range = e.range;
        console.log('on range-:', range);

        const row = range.getRow();
        const column = range.getColumn();
        const text = e.range.getValue();

        // Backend URL to handle the request
        const backendUrl = 'https://viso-nest-googl.onrender.com/rows/create';

        // Construct the full URL with query parameters
        const url = `${backendUrl}?row_sheets=${row}&column_sheets=${column}&text=${encodeURIComponent(text)}`;

        // Make the GET request
        const options = {
            method: 'get',
        };
        //const response = UrlFetchApp.fetch(url, options);

        //console.log('Data sent to backend:', url, 'Response:', response.getResponseCode());
    } catch (error) {
        console.error('Error in onEdit:', error.message);
    }
}

function doGet(e) {
    try {
        console.log('Source-:', e.source);
        const userEmail = e.user.getEmail();
        console.log('userEmail-:',userEmail);

        const getSheets = e.source.getSheets();
        console.log('getSheets-:',getSheets);

        // Extract query parameters sent by your backend or triggered by Google Sheets
        const range = e.source.getRange();
        console.log('range-:', range);

        const getDataRange = e.source.getDataRange();
        console.log('getDataRange-:', getDataRange);

        const row = range.getRow();
        const column = range.getColumn();
        const text = range.getValue();

        // Log event details for debugging
        console.log('Row:', row, 'Column:', column, 'Value:', text);

        // Log the received data for debugging
        console.log('Edited range:', range.getA1Notation());

        // If the row, column, or text is missing, log an error
        if (!row || !column || !text) {
            console.error('Missing parameters in request');
            return ContentService
                .createTextOutput(JSON.stringify({ success: false, error: 'Missing parameters in request' }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        // Forward the request to your backend
        const url = `https://viso-nest-googl.onrender.com/rows/create?row_sheets=${row}&column_sheets=${column}&text=${encodeURIComponent(text)}`;
        const options = {
            method: 'get', // Use GET method
        };

        const response = UrlFetchApp.fetch(url, options);

        // Return success message
        return ContentService
            .createTextOutput(JSON.stringify({ success: true, status: response.getResponseCode() }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        console.error('Error in doGet:', error.message);
        return ContentService
            .createTextOutput(JSON.stringify({ success: false, error: error.message }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

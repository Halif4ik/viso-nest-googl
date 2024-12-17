/*POST*/
function doGet(e) {
    try {
        // Extract data from the edited cell and user information
        const getCurrentCell = e.source.getSheets()[0].getCurrentCell();
        const row = getCurrentCell.getRow();
        const column = getCurrentCell.getColumn();
        const text = getCurrentCell.getValues()[0][0];

        const userEmail = e.user.getEmail();
        console.log('getUserLoginId:', e.user.getUserLoginId());
        console.log('getUsername:', e.user.getUsername());

        // Create the JSON payload for the POST request
        const payload = {
            row_sheets: row,
            column_sheets: column,
            user_email: userEmail,
            text: text
        };

        // Set up the POST request options
        const url = 'https://viso-nest-googl.onrender.com/rows/create';
        const options = {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify(payload)
        };

        // Log event details for debugging
        console.log('Payload:', payload);

        // Send the POST request
        UrlFetchApp.fetch(url, options);
    } catch (error) {
        console.error('Error in doGet:', error.message);
        return ContentService
            .createTextOutput(JSON.stringify({ success: false, error: error.message }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**/
function doGet(e) {
    const email = Session.getActiveUser().getEmail();
    console.log('email!!!:', email);
    return ContentService.createTextOutput(JSON.stringify({ email }))
        .setMimeType(ContentService.MimeType.JSON);
}
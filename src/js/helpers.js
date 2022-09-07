import 'regenerator-runtime/runtime'        // polyfilling async/await
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const AJAX = async function (url, uploadData = undefined) {    // as a Promise
    try {
        const fetchPro = uploadData ? fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData)
        }) : fetch(url)

        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)])
        const data = await res.json()

        if (!res.ok) throw new Error(`${data.message} (${res.status})`)           // Reject

        return data     // Resolve

    } catch (err) {
        throw err      // Reject
    }
}

// export const getJSON = async function (url) {          // as a Promise
//     try {
//         const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)])
//         const data = await res.json()

//         if (!res.ok) throw new Error(`${data.message} (${res.status})`)           // Reject

//         return data     // Resolve

//     } catch (err) {
//         throw err      // Reject
//     }
// }

// export const sendJSON = async function (url, uploadData) {          // as a Promise
//     try {
//         const fetchPro = fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(uploadData)
//         })
//         const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)])
//         const data = await res.json()

//         if (!res.ok) throw new Error(`${data.message} (${res.status})`)        // reject

//         return data     // Resolve

//     } catch (err) {
//         throw err      // Reject
//     }
// }
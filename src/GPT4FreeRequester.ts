import fetch from 'node-fetch-commonjs'
export default class GPT4FreeRequester{


    async getResponse(prompt:string, chatid?:number){
        const body = {
            "request": prompt
        };

        const response = await fetch('http://127.0.0.1:8008', {
	        method: 'POST',
	        body: JSON.stringify(body),
	        headers: {'Content-Type': 'application/json'}
        });
        
        const data: any = await response.json();
        

        
        return data['response'];
        
    }




}

class ChatEntry{

}
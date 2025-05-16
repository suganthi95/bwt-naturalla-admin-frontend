import ReactGA from 'react-ga4'
export const initializeGA = ()=>{
    ReactGA.initialize('G-GPZWVYKQ9D')
}

// track page views
export const trackpPageView = (url:string,email:string)=>{
    ReactGA.send({hitType:'pageview',page:url,email}) 
}
// tracke events 
// export const trackEvents:UaEventOptions = (category:string,action:string,email:string,label?:string,)=>{
//     ReactGA.event({
//     category,
//     action,
//     label,
//     user_mail:email
// })
// }
export const trackEvent = (category: string, action: string, label?: string) => {
    // It's better to anonymize user data or use custom dimensions for sensitive information
    ReactGA.event({
      category,
      action,
      label,
      // user_mail: email 
    });
  };
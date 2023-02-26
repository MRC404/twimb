import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'; 

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }else if(e.target.dataset.btnComment){
        handleWriteComment(e.target.dataset.btnComment)
    }else if(e.target.dataset.delete){
        handleDeleteComment(e.target.dataset.delete.split(" "))
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleWriteComment(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const inputComment = document.getElementById(`input-comment-${tweetId}`)

    if(inputComment.value){
        targetTweetObj.replies.push(
            {
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: inputComment.value,
                uuid: uuidv4()
            })
            render()
            inputComment = ''
    }

    
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleDeleteComment(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId[0]
    })

    render()
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){

                if(reply.handle === `@Scrimba`){
                    repliesHtml+= `
                       <div class="tweet-reply">
                           <div class="tweet-inner">
                               <img src="${reply.profilePic}" class="profile-pic">
                                   <div>
                                       <p class="handle">${reply.handle}</p>
                                       <p class="tweet-text">${reply.tweetText}</p>
                                   </div>
                                   <i class="fa-solid fa-trash delete-icon" data-delete="${tweet.uuid}  
                                   ${reply.uuid}"></i>
                               </div>
                       </div>
                   `   
                   }
                   else {
                        repliesHtml+= `
                           <div class="tweet-reply">
                               <div class="tweet-inner">
                                   <img src="${reply.profilePic}" class="profile-pic">
                                       <div>
                                           <p class="handle">${reply.handle}</p>
                                           <p class="tweet-text">${reply.tweetText}</p>
                                       </div>
                                   </div>
                           </div>
                           `
                   }
//                 repliesHtml+=`
// <div class="tweet-reply">
//     <div class="tweet-inner">
//         <img src="${reply.profilePic}" class="profile-pic">
//             <div>
//                 <p class="handle">${reply.handle}</p>
//                 <p class="tweet-text">${reply.tweetText}</p>
//             </div>
//             <i class="fa-solid fa-trash delete-icon" data-delete="${tweet.uuid} 
//             ${reply.uuid}"></i>
//         </div>
// </div>
// `
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>       
    </div>
        
    <div class="hidden" id="replies-${tweet.uuid}">
    
        ${repliesHtml}
    <div class="write-comment-div hidden" id="write-comment-div-${tweet.uuid}">
        <input type="text" placeholder="Write your comment" class="write-comment" id="input-comment-${tweet.uuid}">
        <button class="btn-comment" id="${tweet.uuid}" data-btn-comment="${tweet.uuid}"><i class="fa-regular fa-paper-plane"></i></button>
    </div>
    </div>
</div>


`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()


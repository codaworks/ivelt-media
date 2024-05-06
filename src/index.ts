const posts = document.querySelectorAll('.postprofile + .postbody .content, #preview .postbody .content')

for (const post of posts) {
    const links = post.querySelectorAll(`
    .content > a[href^="https://drive.google.com/file/d/"],
    .content > :not(blockquote) a[href^="https://drive.google.com/file/d/"],
    .content > a[href^="https://www.dropbox.com/"][href$="&dl=0"], 
    .content > :not(blockquote) a[href^="https://www.dropbox.com"][href$="&dl=0"]
    `)
    if (!links.length)
        continue

    const media = [...links].map(l => {
        const href = l.getAttribute('href') as string

        let id: string | undefined
        let type: 'google-drive' | 'dropbox'

        if (href.startsWith('https://drive.google.com')) {
            id = /^https:\/\/drive.google.com\/file\/d\/([^/]+)/.exec(href)?.[1]
            type = 'google-drive'
        }

        else if (href.startsWith('https://www.dropbox.com')) {
            id = /^https:\/\/www.dropbox.com\/(.+)\&dl=0/.exec(href)?.[1]
            type = 'dropbox'
        }

        return {
            title: l.textContent ?? href,
            href,
            id,
            type: type!
        }
    })


    post.insertAdjacentHTML('afterend',
        `<div class='ivelt-media__root'>
        ${media.map(m => `<div class='container'>
            <div class='skeleton'></div>
            ${m.type === 'google-drive' ?
                `<iframe 
                    src='https://drive.google.com/file/d/${m.id}/preview' 
                    frameborder='0' 
                    allowfullscreen>
                    Your browser does not support this content
                </iframe>`
                :
                `<video controls preview='metadata'>
                    <source src='https://dl.dropbox.com/${m.id}&dl=1'/>
                    Your browser does not support this content
                </video>`
            }
        </div>`).join('')}
    </div>`)
}

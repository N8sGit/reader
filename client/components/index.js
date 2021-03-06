/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export {default as Main} from './main'
export {default as Home} from './home'
export {Login, Signup} from './auth-form'
export {default as Admin} from './admin'
export  {Sidebar} from './sidebar'
export {CategoryView} from './categoryView'
export {default as PostView} from './postView'
export {About} from './about'

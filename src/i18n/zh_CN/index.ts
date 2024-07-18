import tasks from './elements/tasks'
import events from './elements/events'
import gateway from './elements/gateway'
import other from './elements/other'
import lint from './lint'
import panel from './panel'
import toolbar from './toolbar'

export default {
  elements: {
    ...other,
    ...events,
    ...gateway,
    ...tasks
  },
  lint,
  panel,
  toolbar
}

import {defineComponent, markRaw, ref} from 'vue';
import {PageHeader} from "ant-design-vue";
import EventEmitter from "@/utils/EventEmitter";
import {getModeler, setCurrentElement} from "@/utils/BpmnHolder";
import {debounce} from "@/utils/BpmnElementHelper";
import {Element} from "bpmn-js/lib/model/Types";
import Logger from "@/utils/Logger";

export default defineComponent({
    name: 'Panel',
    setup() {
        const currentElement = ref<Element | null>(null);
        // 设置选中元素，更新 store
        const changeElement = debounce((element: Element | null) => {
            const modeler = getModeler();
            const elementRegistry = modeler?.get<any>('elementRegistry')
            let activatedElement: Element | null = element
            // 验证当前选中节点
            if (!activatedElement) {
                activatedElement = elementRegistry?.find((el:Element) => el.type === 'bpmn:Process')
                    || elementRegistry?.find((el:Element) => el.type === 'bpmn:Collaboration')
                if (!activatedElement) return Logger.prettyError('No Element found!')
            }
            // 缓存当前节点信息
            setCurrentElement(markRaw(activatedElement))
            currentElement.value = activatedElement
            // 推送事件消息
            EventEmitter.emit('element-update', activatedElement)
            Logger.prettyPrimary('Selected element changed', `ID: ${activatedElement.id} , type: ${activatedElement.type}`)
        }, 100)
        // 监听事件
        EventEmitter.on('modeler-init', (modeler: any) => {
            modeler.on('import.done', () => changeElement(null))
            // 监听选择事件，修改当前激活的元素以及表单
            modeler.on('selection.changed', ({ newSelection }) => changeElement(newSelection[0] || null))
            modeler.on('element.changed', ({ element }) => {
                // 保证 修改 "默认流转路径" 等类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
                if (element && element.id === currentElement.value?.id) changeElement(element)
            })
            modeler.on('element.click', (event: Event) => {
                Logger.prettyPrimary('Element Click', event)
            })
        })



        return () => (
            <PageHeader title={currentElement?.value?.type.split(':')[1]}/>
        );
    }
});

<script lang='ts' setup>
  import { Space, Button, Modal,Textarea,Upload} from 'ant-design-vue'
  import { ref } from 'vue'
  import { getModeler } from '../utils/BpmnHolder'
  import { message } from '@/components/utils/BpmnElementHelper'

  // 查看xml
  const xml = ref<string>('')
  const xmlShow = ref<boolean>(false)
  const showXml = async () => {
    const xmlRes = await getModeler()?.saveXML({format:true});
    xml.value = xmlRes?.xml || ''
    xmlShow.value = true
  }
  // 导入
  const importXml = (file:any) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      getModeler()?.importXML(reader.result?.toString() || '').then(res => {
        if(res.warnings.length > 0){
          message('error','文档格式错误，无法导入')
        }else{
          message('success','导入成功')
        }
      })
    }
    return false
  }

</script>
<template>
  <Space class='toolbar-space'>
    <Upload :show-upload-list='false' :before-upload='importXml'><Button type='primary'>导入</Button></Upload>
    <Button type='primary' @click='showXml'>XML</Button>
    <Button type='primary'>下载</Button>
    <Button type='primary'>检查</Button>

    <Modal title='BpmnXml查看' v-model:open='xmlShow' okText='保存' cancelText='取消' width="100%" wrap-class-name="full-modal">
        <Textarea autoSize :bordered="false" v-model:value='xml'/>
    </Modal>
  </Space>
</template>
<style scoped lang='scss'>
  .toolbar-space {
    margin-left: 50px;
  }

</style>

<style lang='less'>
  .full-modal {
    .ant-modal {
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    }
    .ant-modal-content {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh);
    }
    .ant-modal-confirm-body-wrapper{
      display: flex;
    }
    .ant-modal-body ,.ant-modal-confirm-body{
      flex: 1;
    }
  }
</style>

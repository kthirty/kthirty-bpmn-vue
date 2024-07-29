import { Rule } from 'bpmnlint';
import { getExPropValue } from '@/components/utils/BpmnElementHelper'

const userTaskAssignee: Rule = () => {
  return {
    check(node, reporter) {
      if (node.$type === 'bpmn:UserTask') {
        const hasAssignee = getExPropValue<string>(node,"assignee")?.trim() !== '';
        const hasCandidateUsers = getExPropValue<string>(node,"candidateUsers")?.trim() !== '';
        const hasCandidateGroups = getExPropValue<string>(node,"candidateGroups")?.trim() !== '';

        console.log(hasAssignee,hasCandidateUsers,hasCandidateGroups)
        if (!hasAssignee && !hasCandidateUsers && !hasCandidateGroups) {
          reporter.report(node.id, 'User task should have an assignee, candidate users, or candidate groups.');
        }
      }
    }
  };
};

export default userTaskAssignee;

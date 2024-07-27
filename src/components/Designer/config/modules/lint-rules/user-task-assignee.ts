import { Rule } from 'bpmnlint';

const userTaskAssignee: Rule = () => {
  return {
    check(node, reporter) {
      if (node.$type === 'bpmn:UserTask') {
        const hasAssignee = node.assignee && node.assignee.trim() !== '';
        const hasCandidateUsers = node.candidateUsers && node.candidateUsers.trim() !== '';
        const hasCandidateGroups = node.candidateGroups && node.candidateGroups.trim() !== '';

        if (!hasAssignee && !hasCandidateUsers && !hasCandidateGroups) {
          reporter.report(node.id, 'User task should have an assignee, candidate users, or candidate groups.');
        }
      }
    }
  };
};

export default userTaskAssignee;

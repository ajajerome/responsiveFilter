using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

namespace Fotbollsresan.Interactive
{
    [Serializable]
    public class InteractiveChoice
    {
        public string Text;
        public string NextNodeId; // empty => end
    }

    [Serializable]
    public class InteractiveNode
    {
        public string Id;
        public string Prompt;
        public List<InteractiveChoice> Choices = new List<InteractiveChoice>();
    }

    [Serializable]
    public class InteractiveSequence
    {
        public string StartNodeId;
        public List<InteractiveNode> Nodes = new List<InteractiveNode>();

        public InteractiveNode FindNode(string id)
        {
            return Nodes.Find(n => n.Id == id);
        }
    }

    public class InteractiveSequenceRunner : MonoBehaviour
    {
        [SerializeField] private InteractiveSequence sequence;
        [SerializeField] private string currentNodeId;

        [Serializable]
        public class NodeChangedEvent : UnityEvent<InteractiveNode> {}
        [Serializable]
        public class SequenceEndedEvent : UnityEvent {}

        public NodeChangedEvent OnNodeChanged = new NodeChangedEvent();
        public SequenceEndedEvent OnSequenceEnded = new SequenceEndedEvent();

        private void Start()
        {
            if (sequence != null)
            {
                currentNodeId = string.IsNullOrEmpty(sequence.StartNodeId) && sequence.Nodes.Count > 0
                    ? sequence.Nodes[0].Id
                    : sequence.StartNodeId;
                EmitNode();
            }
        }

        public InteractiveNode GetCurrentNode()
        {
            return sequence?.FindNode(currentNodeId);
        }

        public void SelectChoice(int index)
        {
            var node = GetCurrentNode();
            if (node == null) return;
            if (index < 0 || index >= node.Choices.Count) return;
            var next = node.Choices[index].NextNodeId;
            if (string.IsNullOrEmpty(next))
            {
                OnSequenceEnded.Invoke();
                return;
            }
            currentNodeId = next;
            EmitNode();
        }

        private void EmitNode()
        {
            var node = GetCurrentNode();
            if (node != null)
            {
                OnNodeChanged.Invoke(node);
            }
            else
            {
                OnSequenceEnded.Invoke();
            }
        }
    }
}


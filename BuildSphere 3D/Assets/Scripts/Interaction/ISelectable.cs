using UnityEngine;

namespace BuildSphere.Interaction
{
    public enum SelectableType
    {
        Building,
        Floor,
        Room,
        Equipment,
        Sensor,
        Component,
        Structure,
        Furniture,
        Infrastructure
    }

    public interface ISelectable
    {
        string SelectableId { get; }
        string DisplayName { get; }
        SelectableType Type { get; }

        void OnSelect();
        void OnDeselect();
        void OnHoverEnter();
        void OnHoverExit();
        Vector3 GetFocusPoint();
    }
}
using UnityEngine;
using UnityEngine.UI;

namespace Fotbollsresan.UI.Navigation
{
    public class SimpleTabNavigator : MonoBehaviour
    {
        [SerializeField] private GameObject homePanel;
        [SerializeField] private GameObject dashboardPanel;
        [SerializeField] private GameObject profilePanel;
        [SerializeField] private Button homeButton;
        [SerializeField] private Button dashboardButton;
        [SerializeField] private Button profileButton;

        private void Awake()
        {
            homeButton.onClick.AddListener(() => Show(homePanel));
            dashboardButton.onClick.AddListener(() => Show(dashboardPanel));
            profileButton.onClick.AddListener(() => Show(profilePanel));
            Show(homePanel);
        }

        private void Show(GameObject panel)
        {
            if (homePanel != null) homePanel.SetActive(panel == homePanel);
            if (dashboardPanel != null) dashboardPanel.SetActive(panel == dashboardPanel);
            if (profilePanel != null) profilePanel.SetActive(panel == profilePanel);
        }
    }
}


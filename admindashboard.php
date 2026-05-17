<?php
header('Content-Type: application/json');

// ==========================================
// 1️⃣ كلاس الـ OOP للأدمن (العقل المدبر)
// ==========================================
require_once 'Database.php';

class AdminDashboard {
    private $db;

    public function __construct() {
        // فحص الأمان: التأكد من الـ Session قبل السماح بأي عملية
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'System Admin') {
            echo json_encode(['success' => false, 'message' => 'Unauthorized access!']);
            exit();
        }

        $this->db = new Database();
    }

    // إحصائيات الكروت الكبرى
    public function getOverviewStats() {
        return [
            'total_donations'  => (float)($this->db->fetchColumn("SELECT SUM(amount) FROM transactions") ?? 0),
            'active_projects'  => (int)$this->db->fetchColumn("SELECT COUNT(*) FROM projects"),
            'pending_cases'    => (int)$this->db->fetchColumn("SELECT COUNT(*) FROM beneficiary_cases WHERE status='Pending'"),
            'total_donors'     => (int)$this->db->fetchColumn("SELECT COUNT(*) FROM users WHERE role='Donor'")
        ];
    }

    // جلب بيانات الجداول والمشاريع
    public function getProjects() {
        return $this->db->fetchAll("SELECT * FROM projects ORDER BY id DESC");
    }

    public function getRecentTransactions() {
        return $this->db->fetchAll("SELECT * FROM transactions ORDER BY date_recorded DESC LIMIT 5");
    }

    public function getBeneficiaryCases() {
        return $this->db->fetchAll("SELECT * FROM beneficiary_cases ORDER BY id DESC");
    }

    public function getDonors() {
        return $this->db->fetchAll("SELECT id, name, email, wallet_balance, total_donated, joined_date FROM users WHERE role='Donor' ORDER BY joined_date DESC");
    }

    // العمليات التنفيذية (Actions)
    public function createProject($name, $category, $target) {
        $name = strip_tags($name);
        $target = floatval($target);
        if (!empty($name) && $target >= 100) {
            return $this->db->execute(
                "INSERT INTO projects (name, category, target_amount) VALUES (?, ?, ?)",
                [$name, $category, $target]
            );
        }
        return false;
    }

    public function updateCaseStatus($case_id, $status) {
        $case_id = intval($case_id);
        if (in_array($status, ['Approved', 'Rejected'])) {
            return $this->db->execute(
                "UPDATE beneficiary_cases SET status = ? WHERE id = ?",
                [$status, $case_id]
            );
        }
        return false;
    }
}


// ==========================================
// 2️⃣ نقطة استقبال وتشغيل الأوبجكت (API Execution)
// ==========================================

// إنشاء كائن الأدمن (يتم التحقق من الحماية فوراً داخل الـ Constructor)
$admin = new AdminDashboard();

// التعامل مع طلبات جلب البيانات (GET Requests)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';

    switch ($action) {
        case 'get_stats':
            echo json_encode(['success' => true, 'data' => $admin->getOverviewStats()]);
            break;
            
        case 'get_projects':
            echo json_encode(['success' => true, 'data' => $admin->getProjects()]);
            break;

        case 'get_cases':
            echo json_encode(['success' => true, 'data' => $admin->getBeneficiaryCases()]);
            break;

        case 'get_donors':
            echo json_encode(['success' => true, 'data' => $admin->getDonors()]);
            break;

        case 'get_transactions':
            echo json_encode(['success' => true, 'data' => $admin->getRecentTransactions()]);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid GET action']);
    }
    exit();
}

// التعامل مع طلبات التنفيذ والإرسال (POST Requests)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // دعم استقبال البيانات بصيغتي Form Data العادية أو JSON Body المرسلة من الـ JS Fetch
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $action = $input['action'] ?? '';

    if ($action === 'create_project') {
        $result = $admin->createProject($input['name'], $input['category'], $input['target']);
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Project created successfully!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create project. Check data inputs.']);
        }
        exit();
    }

    if ($action === 'update_case') {
        $result = $admin->updateCaseStatus($input['case_id'], $input['status']);
        if ($result) {
            echo json_encode(['success' => true, 'message' => "Case status updated to {$input['status']}!"]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update case status.']);
        }
        exit();
    }

    echo json_encode(['success' => false, 'message' => 'Invalid POST action']);
    exit();
}
?>